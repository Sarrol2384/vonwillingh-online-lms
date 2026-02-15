/**
 * Course Import API Module
 * Handles course import functionality with admin authentication
 */

import { Context } from 'hono'
import { SupabaseClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Types
interface CourseImportRequest {
  name: string
  level: string
  category?: string
  price?: number
  code?: string
  description?: string
  duration?: string
  modules: ModuleImportData[]
}

interface ModuleImportData {
  title: string
  description?: string
  content: string
  order_number: number
  video_url?: string
  duration_minutes?: number
  module_number?: number
}

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
}

/**
 * Middleware: Verify admin authentication
 */
export async function requireAdmin(c: Context, next: () => Promise<void>) {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, message: 'Authentication required' }, 401)
  }

  const token = authHeader.substring(7)
  const supabase = c.get('supabase') as SupabaseClient

  // Verify token in admin_sessions
  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('admin_user_id, expires_at')
    .eq('token', token)
    .single()

  if (error || !session) {
    return c.json({ success: false, message: 'Invalid authentication token' }, 401)
  }

  // Check if token expired
  if (new Date(session.expires_at) < new Date()) {
    await supabase.from('admin_sessions').delete().eq('token', token)
    return c.json({ success: false, message: 'Session expired' }, 401)
  }

  // Get admin user
  const { data: adminUser, error: userError } = await supabase
    .from('admin_users')
    .select('id, email, full_name, role, is_active')
    .eq('id', session.admin_user_id)
    .single()

  if (userError || !adminUser || !adminUser.is_active) {
    return c.json({ success: false, message: 'Admin user not found or inactive' }, 401)
  }

  // Store admin user in context
  c.set('adminUser', adminUser)
  
  await next()
}

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
export async function adminLogin(c: Context) {
  const { email, password } = await c.req.json()
  const supabase = c.get('supabase') as SupabaseClient

  // Find admin user
  const { data: adminUser, error } = await supabase
    .from('admin_users')
    .select('id, email, password_hash, full_name, role, is_active')
    .eq('email', email)
    .single()

  if (error || !adminUser) {
    return c.json({ success: false, message: 'Invalid email or password' }, 401)
  }

  if (!adminUser.is_active) {
    return c.json({ success: false, message: 'Account is inactive' }, 401)
  }

  // Verify password
  const passwordValid = await bcrypt.compare(password, adminUser.password_hash)
  
  if (!passwordValid) {
    return c.json({ success: false, message: 'Invalid email or password' }, 401)
  }

  // Create session token
  const token = generateToken()
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiry

  await supabase.from('admin_sessions').insert({
    admin_user_id: adminUser.id,
    token,
    expires_at: expiresAt.toISOString()
  })

  return c.json({
    success: true,
    message: 'Login successful',
    token,
    admin: {
      id: adminUser.id,
      email: adminUser.email,
      full_name: adminUser.full_name,
      role: adminUser.role
    },
    expires_at: expiresAt.toISOString()
  })
}

/**
 * POST /api/admin/logout
 * Admin logout endpoint
 */
export async function adminLogout(c: Context) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ success: true, message: 'Already logged out' })
  }

  const token = authHeader.substring(7)
  const supabase = c.get('supabase') as SupabaseClient

  await supabase.from('admin_sessions').delete().eq('token', token)

  return c.json({ success: true, message: 'Logged out successfully' })
}

/**
 * POST /api/admin/courses/import
 * Import course with modules
 */
export async function importCourse(c: Context) {
  const supabase = c.get('supabase') as SupabaseClient
  const adminUser = c.get('adminUser') as AdminUser
  
  let courseData: CourseImportRequest
  
  try {
    courseData = await c.req.json()
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid JSON format'
    }, 400)
  }

  // Validate required fields
  if (!courseData.name || !courseData.level) {
    return c.json({
      success: false,
      message: 'Missing required fields: name and level'
    }, 400)
  }

  if (!courseData.modules || courseData.modules.length === 0) {
    return c.json({
      success: false,
      message: 'At least one module is required'
    }, 400)
  }

  let courseId: number | null = null
  let importLogId: string | null = null

  try {
    // Start transaction by creating import log
    const { data: importLog, error: logError } = await supabase
      .from('import_logs')
      .insert({
        admin_user_id: adminUser.id,
        course_name: courseData.name,
        modules_count: courseData.modules.length,
        status: 'pending',
        import_data: courseData
      })
      .select('id')
      .single()

    if (logError) throw logError
    importLogId = importLog.id

    // Get next course ID
    const { data: maxIdResult } = await supabase
      .from('courses')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    const nextId = (maxIdResult?.id || 0) + 1

    // Insert course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        id: nextId,
        name: courseData.name,
        code: courseData.code || generateCourseCode(courseData.name),
        level: courseData.level,
        category: courseData.category || 'General',
        description: courseData.description || '',
        duration: courseData.duration || '4 weeks',
        price: courseData.price || 0,
        modules_count: courseData.modules.length
      })
      .select('id')
      .single()

    if (courseError) throw new Error(`Failed to create course: ${courseError.message}`)
    courseId = course.id

    // Insert modules
    let successCount = 0
    for (const moduleData of courseData.modules) {
      const { error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          module_number: moduleData.module_number || moduleData.order_number,
          title: moduleData.title,
          description: moduleData.description || '',
          content: moduleData.content,
          content_type: 'lesson',
          duration_minutes: moduleData.duration_minutes || 45,
          order_index: moduleData.order_number,
          video_url: moduleData.video_url || '',
          is_published: true
        })

      if (moduleError) {
        console.error(`Failed to insert module: ${moduleError.message}`)
        continue
      }
      successCount++
    }

    // Update import log with success
    await supabase
      .from('import_logs')
      .update({
        course_id: courseId,
        modules_count: successCount,
        status: successCount === courseData.modules.length ? 'success' : 'partial'
      })
      .eq('id', importLogId)

    return c.json({
      success: true,
      message: `Course imported successfully with ${successCount}/${courseData.modules.length} module(s)`,
      course: {
        id: courseId,
        name: courseData.name,
        code: courseData.code || generateCourseCode(courseData.name),
        modules_count: successCount
      },
      import_log_id: importLogId
    })

  } catch (error: any) {
    // Log failure
    if (importLogId) {
      await supabase
        .from('import_logs')
        .update({
          status: 'failed',
          error_message: error.message
        })
        .eq('id', importLogId)
    }

    // Rollback: delete course if created but failed
    if (courseId) {
      await supabase.from('courses').delete().eq('id', courseId)
    }

    return c.json({
      success: false,
      message: error.message || 'Import failed',
      error: error.message
    }, 500)
  }
}

/**
 * GET /api/admin/courses/import/logs
 * Get import history
 */
export async function getImportLogs(c: Context) {
  const supabase = c.get('supabase') as SupabaseClient
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = parseInt(c.req.query('offset') || '0')

  const { data: logs, error } = await supabase
    .from('import_logs')
    .select(`
      id,
      course_name,
      modules_count,
      status,
      error_message,
      created_at,
      admin_users (email, full_name),
      courses (id, code)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return c.json({ success: false, message: error.message }, 500)
  }

  return c.json({
    success: true,
    logs,
    count: logs.length,
    limit,
    offset
  })
}

// Helper functions
function generateToken(): string {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

function generateCourseCode(courseName: string): string {
  const words = courseName.toUpperCase().split(' ')
  const prefix = words.slice(0, 2).map(w => w.substring(0, 3)).join('')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}${random}`
}
