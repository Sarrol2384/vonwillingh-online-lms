/**
 * Simple Course Import Integration
 * Following VONWILLINGH_QUICKSTART.md specification
 * 
 * This file adds the import API to your existing index.tsx
 * Add these routes to your Hono app
 */

// Add to imports at top of index.tsx:
// import { requireAdmin, adminLogin, adminLogout, importCourse, getImportLogs } from './import-api-simple'

import { Context } from 'hono'
import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Simple admin check - checks for admin password in header
 * In production, replace with proper authentication
 */
export async function requireAdminSimple(c: Context, next: () => Promise<void>) {
  const adminPass = c.req.header('X-Admin-Password')
  
  // Simple password check (CHANGE THIS IN PRODUCTION!)
  if (adminPass !== 'vonwillingh2024') {
    return c.json({ 
      success: false, 
      message: 'Admin authentication required. Add X-Admin-Password header.' 
    }, 401)
  }
  
  await next()
}

/**
 * POST /api/admin/courses/import
 * Import course following quickstart guide format
 */
export async function importCourseSimple(c: Context) {
  const supabase = c.get('supabaseAdmin') as SupabaseClient
  
  let courseData: any
  
  try {
    courseData = await c.req.json()
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid JSON format'
    }, 400)
  }

  // Validate required fields per quickstart guide
  if (!courseData.name || !courseData.level) {
    return c.json({
      success: false,
      message: 'Missing required fields: name and level are required'
    }, 400)
  }

  if (!courseData.modules || !Array.isArray(courseData.modules) || courseData.modules.length === 0) {
    return c.json({
      success: false,
      message: 'At least one module is required'
    }, 400)
  }

  try {
    // Get next course ID
    const { data: maxIdResult } = await supabase
      .from('courses')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)

    const nextId = maxIdResult && maxIdResult.length > 0 ? maxIdResult[0].id + 1 : 1

    // Generate course code if not provided
    const courseCode = courseData.code || generateCourseCode(courseData.name, nextId)

    // 1. Insert course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        id: nextId,
        name: courseData.name,
        code: courseCode,
        level: courseData.level,
        category: courseData.category || 'General',
        description: courseData.description || '',
        duration: courseData.duration || '4 weeks',
        price: courseData.price || 0,
        modules_count: courseData.modules.length
      })
      .select('id')
      .single()

    if (courseError) {
      throw new Error(`Failed to create course: ${courseError.message}`)
    }

    const courseId = course.id

    // 2. Insert modules
    let successCount = 0
    const moduleErrors: string[] = []

    for (const moduleData of courseData.modules) {
      // Validate module data
      if (!moduleData.title || !moduleData.content || moduleData.order_number === undefined) {
        moduleErrors.push(`Module missing required fields: title, content, or order_number`)
        continue
      }

      const { error: moduleError } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          module_number: moduleData.order_number,
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
        moduleErrors.push(`Module "${moduleData.title}": ${moduleError.message}`)
        continue
      }
      successCount++
    }

    // Return success response per quickstart guide
    return c.json({
      success: true,
      message: `Course imported successfully with ${successCount} module(s)`,
      course: {
        id: courseId,
        name: courseData.name,
        code: courseCode,
        modules_count: successCount
      },
      ...(moduleErrors.length > 0 && {
        warnings: moduleErrors,
        partial: true
      })
    })

  } catch (error: any) {
    return c.json({
      success: false,
      message: error.message || 'Import failed',
      error: error.message
    }, 500)
  }
}

/**
 * GET /api/admin/courses/import/test
 * Test endpoint to verify import system is working
 */
export async function testImportSystem(c: Context) {
  return c.json({
    success: true,
    message: 'Import system is ready!',
    endpoints: {
      import: 'POST /api/admin/courses/import',
      test: 'GET /api/admin/courses/import/test'
    },
    required_format: {
      name: 'string (required)',
      level: 'string (required)',
      category: 'string (optional)',
      price: 'number (optional)',
      code: 'string (optional - will be auto-generated)',
      description: 'string (optional)',
      duration: 'string (optional, default: "4 weeks")',
      modules: [
        {
          title: 'string (required)',
          description: 'string (optional)',
          content: 'string (required, HTML)',
          order_number: 'number (required)',
          video_url: 'string (optional)',
          duration_minutes: 'number (optional, default: 45)'
        }
      ]
    },
    sample_request: {
      name: 'Test Import Course',
      level: 'Certificate',
      category: 'Testing',
      price: 5000,
      modules: [
        {
          title: 'Test Module 1',
          description: 'First module',
          content: '<h1>Test Content</h1><p>This is a test.</p>',
          order_number: 1
        }
      ]
    }
  })
}

// Helper function
function generateCourseCode(courseName: string, courseId: number): string {
  const words = courseName.toUpperCase().split(' ')
  const prefix = words.slice(0, 2).map(w => w.substring(0, 3)).join('')
  return `${prefix}${courseId.toString().padStart(3, '0')}`
}

/**
 * USAGE IN index.tsx:
 * 
 * // Add after existing imports:
 * import { requireAdminSimple, importCourseSimple, testImportSystem } from './import-api-simple'
 * 
 * // Add these routes:
 * 
 * // Test endpoint (no auth required)
 * app.get('/api/admin/courses/import/test', testImportSystem)
 * 
 * // Import endpoint (requires admin password header)
 * app.post('/api/admin/courses/import-simple', requireAdminSimple, async (c) => {
 *   const supabase = getSupabaseAdminClient(c.env)
 *   c.set('supabaseAdmin', supabase)
 *   return importCourseSimple(c)
 * })
 */
