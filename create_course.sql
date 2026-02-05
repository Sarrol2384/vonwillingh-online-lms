
-- ============================================
-- AUTO-GENERATED COURSE CREATION SCRIPT
-- Course: Digital Marketing for South African Small Businesses
-- ============================================

-- Step 1: Get next course ID
DO $$
DECLARE
    next_id INTEGER;
    new_course_id INTEGER;
BEGIN
    -- Get max ID
    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM courses;
    
    -- Insert course
    INSERT INTO courses (
        id,
        name,
        code,
        level,
        category,
        description,
        duration,
        price,
        modules_count,
        is_published
    ) VALUES (
        next_id,
        'Digital Marketing for South African Small Businesses',
        'DIGIMKT001',
        'Certificate',
        'Digital Marketing',
        'Master digital marketing strategies tailored for South African small businesses. Learn how to reach your target audience, create compelling content, run effective social media campaigns, and measure your marketing ROI. This practical course covers Facebook, Instagram, Google My Business, email marketing, and content creation - all with a focus on low-budget, high-impact strategies perfect for South African entrepreneurs. No prior marketing experience required!',
        '4 weeks',
        1500,
        3,
        true
    ) RETURNING id INTO new_course_id;
    
    RAISE NOTICE 'Course created with ID: %', new_course_id;
    

    -- Module 1: Module 1: Digital Marketing Fundamentals for SA Businesses
    INSERT INTO modules (
        course_id,
        module_number,
        title,
        description,
        content,
        content_type,
        order_index,
        is_published
    ) VALUES (
        new_course_id,
        1,
        'Module 1: Digital Marketing Fundamentals for SA Businesses',
        'Understand the digital marketing landscape in South Africa, identify your target audience, and create your marketing strategy foundation.',
        '<div style=''background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px; margin-bottom: 30px;''><h1 style=''margin: 0 0 15px 0;''>📱 Module 1: Digital Marketing Fundamentals</h1><p style=''font-size: 1.2em; margin: 0;''>Build Your Marketing Foundation</p></div><div style=''background: #e8f5e9; border-left: 5px solid #4caf50; padding: 25px; margin: 30px 0; border-radius: 5px;''><h3 style=''color: #2e7d32; margin-top: 0;''>🎯 What You''ll Learn</h3><ul style=''line-height: 1.8;''><li>✅ Understand the digital marketing landscape in South Africa</li><li>✅ Identify and define your target audience</li><li>✅ Choose the right digital channels for your business</li><li>✅ Create a simple marketing strategy on any budget</li></ul></div><h2>What is Digital Marketing?</h2><p>Digital marketing is promoting your business using online channels like social media, Google, email, and websites. For South African small businesses, it''s the most cost-effective way to reach customers!</p><div style=''background: #fff3e0; border: 2px solid #ff9800; padding: 20px; margin: 25px 0; border-radius: 8px;''><h4 style=''color: #e65100; margin-top: 0;''>💡 Key Insight</h4><p><strong>You don''t need a big budget!</strong> With R500-R1,000 per month, South African small businesses are seeing real results. It''s about being smart, not rich!</p></div><h3>Why Digital Marketing for SA Businesses?</h3><div style=''display: grid; gap: 15px; margin: 20px 0;''><div style=''background: white; border-left: 4px solid #4caf50; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);''><strong style=''color: #2e7d32;''>💰 Cost-Effective:</strong> Reach 1,000 people on Facebook for R50 (vs R5,000 in newspaper ads)</div><div style=''background: white; border-left: 4px solid #2196f3; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);''><strong style=''color: #1565c0;''>🎯 Targeted:</strong> Show your ads only to people in Johannesburg who love baking (perfect for a bakery!)</div><div style=''background: white; border-left: 4px solid #9c27b0; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);''><strong style=''color: #6a1b9a;''>📊 Measurable:</strong> Know exactly how many people saw your ad, clicked, and bought</div><div style=''background: white; border-left: 4px solid #ff9800; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);''><strong style=''color: #e65100;''>⚡ Fast:</strong> Start today, see results this week!</div></div><h3>Your Target Audience</h3><p>Before spending R1 on marketing, answer these:</p><ol style=''line-height: 1.8;''><li><strong>Who are they?</strong> Age, gender, location, income</li><li><strong>What do they need?</strong> Problems you solve</li><li><strong>Where are they online?</strong> Facebook? WhatsApp? Google?</li><li><strong>When do they buy?</strong> Payday? Weekends?</li></ol><div style=''background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 25px; margin: 25px 0;''><h4 style=''color: #333; margin-top: 0;''>🏪 Real Example: Thabo''s Hardware Store</h4><p><strong>Target Audience:</strong></p><ul><li>Homeowners in Soweto</li><li>Age 30-55</li><li>DIY enthusiasts and contractors</li><li>Active on Facebook and WhatsApp</li></ul><p><strong>Result:</strong> Thabo focused his R800 monthly budget on Facebook ads targeting Soweto only. Sales increased 40% in 2 months!</p></div>',
        'lesson',
        1,
        true
    );
    

    -- Module 2: Module 2: Facebook & Instagram Marketing
    INSERT INTO modules (
        course_id,
        module_number,
        title,
        description,
        content,
        content_type,
        order_index,
        is_published
    ) VALUES (
        new_course_id,
        2,
        'Module 2: Facebook & Instagram Marketing',
        'Master Facebook and Instagram marketing to reach South African customers where they spend their time online.',
        '<div style=''background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px; margin-bottom: 30px;''><h1 style=''margin: 0 0 15px 0;''>📱 Module 2: Facebook & Instagram Marketing</h1><p style=''font-size: 1.2em; margin: 0;''>Reach 30+ Million South Africans on Social Media</p></div><h2>Why Facebook & Instagram?</h2><p><strong>The numbers speak for themselves:</strong></p><div style=''background: #e3f2fd; padding: 25px; margin: 25px 0; border-radius: 8px;''><div style=''background: white; padding: 15px; border-radius: 5px; margin-bottom: 10px;''><div style=''font-size: 2.5em; color: #2196f3; font-weight: bold;''>26 million</div><p style=''margin: 5px 0 0 0; color: #666;''>South Africans on Facebook (2024)</p></div><div style=''background: white; padding: 15px; border-radius: 5px;''><div style=''font-size: 2.5em; color: #2196f3; font-weight: bold;''>10 million</div><p style=''margin: 5px 0 0 0; color: #666;''>South Africans on Instagram (2024)</p></div></div><h3>Creating Engaging Content</h3><p>What works best on Facebook & Instagram in SA:</p><div style=''display: grid; gap: 15px; margin: 20px 0;''><div style=''background: white; border-left: 4px solid #4caf50; padding: 15px; border-radius: 5px;''><strong>📸 Photos:</strong> Before/after, behind-the-scenes, product shots</div><div style=''background: white; border-left: 4px solid #2196f3; padding: 15px; border-radius: 5px;''><strong>🎥 Videos:</strong> How-to guides, customer testimonials (even 30-second clips work!)</div><div style=''background: white; border-left: 4px solid #9c27b0; padding: 15px; border-radius: 5px;''><strong>💬 Stories:</strong> Daily updates, polls, ''swipe up'' for specials</div><div style=''background: white; border-left: 4px solid #ff9800; padding: 15px; border-radius: 5px;''><strong>🎁 Specials:</strong> Limited-time offers, payday deals, township delivery specials</div></div><h3>Facebook Ads on a Budget</h3><p>You can start with as little as R5 per day (R150/month)!</p><div style=''background: #fff3e0; border: 2px solid #ff9800; padding: 20px; margin: 25px 0; border-radius: 8px;''><h4 style=''color: #e65100; margin-top: 0;''>💡 Pro Tip</h4><p>Start with R10/day for 7 days. Learn what works. Then increase budget on winning ads!</p></div>',
        'lesson',
        2,
        true
    );
    

    -- Module 3: Module 3: Google My Business & Local SEO
    INSERT INTO modules (
        course_id,
        module_number,
        title,
        description,
        content,
        content_type,
        order_index,
        is_published
    ) VALUES (
        new_course_id,
        3,
        'Module 3: Google My Business & Local SEO',
        'Get found by local customers searching on Google - the #1 way South Africans find businesses near them.',
        '<div style=''background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px; margin-bottom: 30px;''><h1 style=''margin: 0 0 15px 0;''>🔍 Module 3: Google My Business & Local SEO</h1><p style=''font-size: 1.2em; margin: 0;''>Get Found When Customers Search Near You</p></div><h2>Why Google My Business is FREE Gold</h2><p>When someone searches ''hardware store near me'' or ''best salon in Sandton'', Google My Business puts YOUR business on the map - literally!</p><div style=''background: #e8f5e9; border-left: 5px solid #4caf50; padding: 25px; margin: 30px 0; border-radius: 5px;''><h4 style=''color: #2e7d32; margin-top: 0;''>💰 Best Part: IT''S 100% FREE!</h4><p>No monthly fees, no hidden costs. Just free customers finding you on Google!</p></div><h3>Setting Up Your Google My Business</h3><ol style=''line-height: 1.8; font-size: 1.1em;''><li>Go to <a href=''https://www.google.com/business/''>google.com/business</a></li><li>Click ''Manage Now''</li><li>Enter your business name and address</li><li>Verify with postcard or phone (Google will call/mail you)</li><li>Add photos, hours, description</li><li>Done! You''re on Google Maps! 🎉</li></ol><div style=''background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 25px; margin: 30px 0;''><h4>🏪 Real Success Story: Nomsa''s Salon - Soweto</h4><p><strong>Before Google My Business:</strong> 5 walk-in customers per week</p><p><strong>After setting up (2 weeks later):</strong> 25 new customers from Google searches!</p><p><strong>Cost:</strong> R0</p><p><strong>Nomsa''s tip:</strong> ''I ask every happy customer to leave a Google review. Now I have 47 five-star reviews and I''m the top salon in my area!''</p></div><h3>Getting Great Reviews</h3><p>Reviews = Trust = More Customers!</p><ul style=''line-height: 1.8;''><li>✅ Ask happy customers for reviews (show them how!)</li><li>✅ Respond to ALL reviews (good and bad)</li><li>✅ Keep responses professional and friendly</li><li>✅ Fix problems mentioned in negative reviews</li></ul>',
        'lesson',
        3,
        true
    );
    

END $$;

-- Verify the course was created
SELECT 
    id,
    name,
    code,
    price,
    modules_count
FROM courses 
WHERE code = 'DIGIMKT001';

-- View the modules
SELECT 
    m.id,
    m.module_number,
    m.title,
    c.name as course_name
FROM modules m
JOIN courses c ON m.course_id = c.id
WHERE c.code = 'DIGIMKT001'
ORDER BY m.module_number;
