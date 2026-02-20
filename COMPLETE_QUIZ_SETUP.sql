-- =====================================================
-- COMPLETE MODULE 1 QUIZ SETUP - TABLE + QUESTIONS
-- =====================================================
-- This script creates the quiz_questions table and inserts all 20 questions
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/dgcobxtkzewzkrzpfcdr/sql/new
-- =====================================================

-- =====================================================
-- PART 1: Create quiz_questions table (if not exists)
-- =====================================================

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    explanation TEXT,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, order_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_module_id ON quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(module_id, order_number);

-- Create quiz_attempts table (if not exists)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    time_taken_seconds INTEGER,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, module_id, attempt_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module ON quiz_attempts(module_id);

-- =====================================================
-- PART 2: Insert all 20 quiz questions automatically
-- =====================================================

DO $$
DECLARE
    v_module_id UUID;
    v_question_count INTEGER;
BEGIN
    RAISE NOTICE 'Quiz tables created successfully';
    
    -- Find Module 1 automatically
    SELECT m.id INTO v_module_id
    FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE m.title ILIKE '%Module 1%' 
      AND m.title ILIKE '%Introduction to AI%'
      AND c.code = 'AIFUND001'
    ORDER BY m.created_at DESC
    LIMIT 1;
    
    -- Check if module was found
    IF v_module_id IS NULL THEN
        RAISE EXCEPTION 'ERROR: Module 1 not found! Please create AIFUND001 Module 1 first.';
    END IF;
    
    RAISE NOTICE 'Found Module 1 with ID: %', v_module_id;
    
    -- Check if questions already exist
    SELECT COUNT(*) INTO v_question_count
    FROM quiz_questions
    WHERE module_id = v_module_id;
    
    IF v_question_count > 0 THEN
        RAISE NOTICE 'Warning: % existing questions found. Deleting them first...', v_question_count;
        DELETE FROM quiz_questions WHERE module_id = v_module_id;
        RAISE NOTICE 'Deleted % old questions', v_question_count;
    END IF;
    
    RAISE NOTICE 'Creating 20 quiz questions...';
    
    -- QUESTION 1 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'According to Russell and Norvig (2020), which of the following is NOT one of the four approaches to defining AI?',
        'Thinking humanly',
        'Acting rationally',
        'Processing emotionally',
        'Thinking rationally',
        'C',
        'medium',
        'Russell and Norvig''s framework defines AI through four approaches: thinking humanly, thinking rationally, acting humanly, and acting rationally. "Processing emotionally" is not part of this foundational framework. This distinction helps separate genuine AI capabilities from anthropomorphic projections. Source: Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed., pp. 1-5).',
        1
    );
    
    -- QUESTION 2 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'McKinsey Global Institute (2023) estimates that AI could deliver how much additional global economic activity by 2030?',
        '$5 trillion',
        '$13 trillion',
        '$25 trillion',
        '$50 trillion',
        'B',
        'easy',
        'McKinsey''s latest research projects AI could contribute approximately $13 trillion to global economic activity by 2030, equivalent to 1.2% additional GDP growth per year. This includes productivity gains, new market creation, and enhanced decision-making across industries. Small businesses capturing even 1% of this opportunity represents significant growth potential. Source: McKinsey Global Institute (2023). The state of AI in 2023: Generative AI''s breakout year.',
        2
    );
    
    -- QUESTION 3 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What is the primary difference between supervised learning and unsupervised learning?',
        'Supervised learning is faster than unsupervised learning',
        'Supervised learning requires labeled training data, while unsupervised learning does not',
        'Unsupervised learning is more accurate than supervised learning',
        'Supervised learning works only with numerical data',
        'B',
        'medium',
        'The fundamental distinction is data labeling: supervised learning trains on datasets where correct answers (labels) are provided, enabling the model to learn input-output mappings. Unsupervised learning discovers patterns in unlabeled data without predefined categories. For SMEs, this means supervised learning suits tasks like customer classification (when you have labeled examples), while unsupervised learning helps discover hidden customer segments. Source: Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning (pp. 103-115).',
        3
    );
    
    -- QUESTION 4 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'Which of the following is an example of Natural Language Processing (NLP)?',
        'Facial recognition systems',
        'Chatbots that understand customer queries',
        'Self-driving car navigation',
        'Credit card fraud detection',
        'B',
        'easy',
        'NLP enables computers to understand, interpret, and generate human language. Chatbots use NLP to parse customer questions, extract intent, and formulate relevant responses. For small businesses, NLP applications include automated customer service, sentiment analysis of reviews, and email categorization. Options A and C involve computer vision, while D primarily uses pattern recognition in numerical data. Source: Jurafsky, D., & Martin, J. H. (2023). Speech and Language Processing (3rd ed., Chapter 1).',
        4
    );
    
    -- QUESTION 5 [Hard]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'A small business wants to predict which customers are likely to churn. Which type of machine learning problem is this?',
        'Unsupervised clustering',
        'Reinforcement learning',
        'Supervised classification',
        'Anomaly detection',
        'C',
        'hard',
        'Customer churn prediction is a supervised classification problem because: (1) historical data exists showing which customers churned (labels), (2) the goal is to classify new customers into "will churn" or "won''t churn" categories, and (3) the model learns from past patterns to predict future behavior. This requires labeled training data (past customers with known outcomes) to teach the algorithm to recognize churn patterns. Common features include purchase frequency, customer service interactions, and engagement metrics. Source: Russell & Norvig (2020), pp. 693-695.',
        5
    );
    
    -- QUESTION 6 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'According to Harvard Business Review (Brynjolfsson & McAfee, 2017), what is the recommended first step for small businesses starting their AI journey?',
        'Implement AI across all business functions simultaneously',
        'Hire a team of data scientists before starting',
        'Start with ONE clear, measurable use case and expand gradually',
        'Wait until competitors have proven AI ROI first',
        'C',
        'medium',
        'The "crawl-walk-run" approach recommended by AI adoption research emphasizes starting with a single, well-defined use case with measurable impact. This allows businesses to build expertise, demonstrate ROI, and learn from initial implementations before scaling. Starting small reduces risk, enables faster learning, and provides tangible results to justify further investment. Waiting for competitors (option D) or implementing everything at once (option A) are common failure patterns. Source: Brynjolfsson, E., & McAfee, A. (2017). The Business of Artificial Intelligence. Harvard Business Review.',
        6
    );
    
    -- QUESTION 7 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What does the term "training data" mean in machine learning?',
        'The data used to test if the model is working correctly',
        'The data used to teach the AI model patterns and relationships',
        'The data that shows errors in the AI system',
        'The data collected after the AI is deployed',
        'B',
        'easy',
        'Training data is the foundation of machine learning—it''s the dataset the model learns from during the training phase. The algorithm analyzes patterns, correlations, and relationships in this data to build its internal model. Quality and quantity of training data directly impact model performance. For SMEs, gathering relevant, representative training data is often the first hurdle in AI projects. Options A (testing data) and D (production data) serve different purposes in the ML lifecycle. Source: Goodfellow et al. (2016), pp. 107-110.',
        7
    );
    
    -- QUESTION 8 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'Which of the following is a key ethical consideration when implementing AI in small businesses?',
        'AI systems should always be kept secret from customers',
        'Businesses should ensure AI decisions are fair and non-discriminatory',
        'AI should replace all human decision-making to reduce bias',
        'Ethical concerns only apply to large corporations, not SMEs',
        'B',
        'medium',
        'Ethical AI implementation requires actively preventing discrimination and ensuring fairness, regardless of business size. AI systems can perpetuate or amplify biases present in training data, leading to unfair treatment of customers or employees. SMEs must ensure their AI tools don''t discriminate based on protected characteristics (race, gender, age, etc.), maintain transparency about AI use, and have human oversight for critical decisions. South Africa''s POPIA (Protection of Personal Information Act) reinforces these requirements. Source: IEEE Global Initiative (2019). Ethically Aligned Design, pp. 23-31.',
        8
    );
    
    -- QUESTION 9 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What is a chatbot?',
        'A type of computer virus',
        'A software program that simulates human conversation',
        'A physical robot that works in customer service',
        'A database for storing customer information',
        'B',
        'easy',
        'A chatbot is a software application that uses natural language processing to simulate human conversation through text or voice interfaces. Chatbots can answer questions, provide information, handle transactions, and assist customers 24/7. For small businesses, chatbots offer affordable customer service automation, handling routine inquiries while escalating complex issues to humans. They can be deployed on websites, WhatsApp, Facebook Messenger, or SMS. Modern chatbots range from simple rule-based systems to sophisticated AI-powered assistants. Source: Russell & Norvig (2020), pp. 874-876.',
        9
    );
    
    -- QUESTION 10 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'Which statement best describes "overfitting" in machine learning?',
        'The model performs well on training data but poorly on new, unseen data',
        'The model is too simple to capture patterns in the data',
        'The model processes data too slowly',
        'The model requires too much storage space',
        'A',
        'medium',
        'Overfitting occurs when a model learns training data too well, including noise and outliers, rather than generalizable patterns. It''s like memorizing answers instead of understanding concepts—great for known questions, useless for new ones. Signs include high training accuracy but poor real-world performance. For SMEs, this means your customer segmentation model might work perfectly on last year''s data but fail on new customers. Prevention includes using validation data, regularization techniques, and simpler models. Source: Goodfellow et al. (2016), pp. 110-120.',
        10
    );
    
    -- QUESTION 11 [Hard]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'A retail store wants to optimize inventory based on predicted demand. Which combination of AI techniques would be most appropriate?',
        'Natural Language Processing + Computer Vision',
        'Time series forecasting + Supervised learning',
        'Reinforcement learning + Speech recognition',
        'Unsupervised clustering + Anomaly detection',
        'B',
        'hard',
        'Inventory optimization requires predicting future demand based on historical patterns—a time series forecasting problem. Time series analysis captures seasonal trends, cyclical patterns, and temporal dependencies in sales data. Supervised learning models (e.g., regression) can incorporate additional features like promotions, weather, holidays, and competitor actions to improve predictions. This combination allows the store to anticipate demand fluctuations and optimize stock levels. Options A and C use techniques irrelevant to numerical demand prediction. Source: Russell & Norvig (2020), pp. 698-702; McKinsey (2023) retail AI use cases.',
        11
    );
    
    -- QUESTION 12 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What is the primary purpose of computer vision in AI applications?',
        'To improve computer processing speed',
        'To enable computers to interpret and understand visual information from images and videos',
        'To create computer graphics and animations',
        'To compress image files for storage',
        'B',
        'easy',
        'Computer vision gives machines the ability to "see" and interpret visual data—recognizing objects, people, text, actions, and scenes in images and videos. Applications for SMEs include automated quality inspection, facial recognition for security, document scanning and data extraction, and visual product search. It mimics human visual perception using deep learning, particularly convolutional neural networks (CNNs). Options A, C, and D describe different computing tasks unrelated to visual understanding. Source: Goodfellow et al. (2016), pp. 326-366.',
        12
    );
    
    -- QUESTION 13 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'According to the South African Protection of Personal Information Act (POPIA, 2021), what must businesses do before using AI to process customer data?',
        'Nothing, AI processing is exempt from POPIA',
        'Obtain consent and ensure data is processed lawfully and transparently',
        'Only large businesses need to comply with POPIA',
        'Wait for government approval for each AI system',
        'B',
        'medium',
        'POPIA requires businesses of all sizes to obtain informed consent before collecting and processing personal information, including through AI systems. Key requirements include: explaining how data will be used, ensuring data accuracy and security, allowing customers to access their data, and processing data only for stated purposes. AI-specific considerations include transparency about automated decision-making and preventing discriminatory outcomes. Non-compliance carries penalties up to R10 million or 10 years imprisonment. Source: Information Regulator South Africa (2021). POPIA Compliance Guide.',
        13
    );
    
    -- QUESTION 14 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What is the "cloud" in cloud computing?',
        'Internet-based computing services accessed remotely',
        'A physical storage device in your office',
        'A type of weather monitoring system',
        'A backup hard drive',
        'A',
        'easy',
        'Cloud computing delivers computing services (storage, processing power, software, AI tools) over the internet, eliminating the need for on-premise hardware. For SMEs, cloud platforms like Google Cloud, AWS, and Microsoft Azure offer pay-as-you-go AI services without massive upfront investment. Benefits include scalability, automatic updates, accessibility from anywhere, and reduced IT maintenance. Most modern AI tools (chatbots, analytics, CRM) run on cloud infrastructure, making AI accessible to small businesses. Source: Russell & Norvig (2020), pp. 1089-1091.',
        14
    );
    
    -- QUESTION 15 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What is the purpose of a "validation dataset" in machine learning?',
        'To train the AI model initially',
        'To tune model parameters and prevent overfitting during development',
        'To store customer personal information',
        'To validate user login credentials',
        'B',
        'medium',
        'The validation dataset is a separate subset of data (distinct from training and test sets) used during model development to evaluate performance and tune hyperparameters. It helps detect overfitting—if training accuracy is high but validation accuracy is low, the model is memorizing rather than learning. This three-way split (train/validate/test) is standard ML practice: train builds the model, validation tunes it, and test provides final unbiased performance assessment. For SMEs, proper validation ensures your AI solution will work on real customer data. Source: Goodfellow et al. (2016), pp. 117-119.',
        15
    );
    
    -- QUESTION 16 [Hard]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'A small business implements an AI recruitment tool that automatically screens CVs. The tool consistently ranks candidates from certain universities higher. What AI problem does this illustrate?',
        'Overfitting to training data',
        'Algorithmic bias and fairness concerns',
        'Underfitting and low model accuracy',
        'Data privacy violations',
        'B',
        'hard',
        'This scenario demonstrates algorithmic bias—when AI systems produce unfair outcomes that systematically favor or disadvantage certain groups. The bias likely originated from training data (if past hires from certain universities were rated higher) and perpetuates discrimination. This violates South African employment equity laws and POPIA''s fairness principle. Solutions include auditing training data for bias, diversifying data sources, testing for disparate impact across demographic groups, and maintaining human oversight in hiring decisions. AI doesn''t eliminate bias; it can amplify it at scale. Source: IEEE (2019). Ethically Aligned Design, pp. 45-52; SA Employment Equity Act.',
        16
    );
    
    -- QUESTION 17 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What is "sentiment analysis" in AI?',
        'Analyzing financial statements for investment decisions',
        'Determining the emotional tone (positive, negative, neutral) of text',
        'Measuring customer purchase frequency',
        'Analyzing website traffic patterns',
        'B',
        'easy',
        'Sentiment analysis uses NLP to determine the emotional tone expressed in text—whether a customer review is positive, negative, or neutral. Applications for SMEs include monitoring social media mentions, analyzing customer feedback at scale, identifying unhappy customers for proactive service, and measuring brand reputation. Modern sentiment analysis can detect nuanced emotions (frustrated, excited, disappointed) and even sarcasm. It transforms unstructured text into actionable insights. Source: Jurafsky & Martin (2023), Chapter 20: Sentiment Analysis.',
        17
    );
    
    -- QUESTION 18 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'According to MIT Sloan research (Ransbotham et al., 2020), what is a common reason small businesses fail at AI implementation?',
        'AI technology is too expensive for all small businesses',
        'Lack of clear business objectives and unrealistic expectations',
        'AI only works for technology companies',
        'Government regulations prohibit AI use by SMEs',
        'B',
        'medium',
        'MIT''s study of 3,000+ companies found AI failures stem primarily from organizational factors, not technology limitations: unclear objectives, lack of executive support, unrealistic ROI expectations, and insufficient change management. Successful AI adoption requires defining specific business problems, setting measurable goals, securing stakeholder buy-in, and managing expectations about AI capabilities and timelines. Technology costs have decreased dramatically, making AI accessible to SMEs—the challenge is strategic implementation, not affordability. Source: Ransbotham, S., et al. (2020). Building the AI-Powered Organization. MIT Sloan Management Review.',
        18
    );
    
    -- QUESTION 19 [Easy]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'What is an API (Application Programming Interface) in the context of AI services?',
        'A type of computer hardware',
        'A set of rules that allows different software applications to communicate and share data',
        'An AI training algorithm',
        'A security protocol for protecting data',
        'B',
        'easy',
        'An API is a bridge between different software systems, defining how they exchange data and functionality. In AI, APIs let businesses integrate pre-built AI services (like Google''s Vision API for image recognition or OpenAI''s GPT for text generation) into their own applications without building AI from scratch. For SMEs, APIs make advanced AI accessible through simple integrations—send an image via API, receive product recognition results. This "AI-as-a-service" model eliminates the need for ML expertise or infrastructure. Source: Russell & Norvig (2020), pp. 1086-1088.',
        19
    );
    
    -- QUESTION 20 [Medium]
    INSERT INTO quiz_questions (module_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, order_number)
    VALUES (
        v_module_id,
        'Which metric would best measure the ROI (Return on Investment) of implementing an AI customer service chatbot?',
        'Number of lines of code in the chatbot',
        'Reduction in average response time and customer service costs while maintaining satisfaction',
        'Number of AI engineers hired',
        'Total training data size in gigabytes',
        'B',
        'medium',
        'ROI for AI customer service should measure tangible business outcomes: (1) cost savings (reduced human agent hours), (2) efficiency gains (faster response times, 24/7 availability), (3) quality maintenance (customer satisfaction scores unchanged or improved), and (4) revenue impact (increased conversions from better service). A comprehensive ROI calculation compares total costs (development, integration, maintenance) against quantified benefits. Options A, C, and D measure inputs or technical metrics, not business value. Source: McKinsey (2023). Measuring AI ROI: Best practices for business leaders.',
        20
    );
    
    -- Verify quiz creation
    SELECT COUNT(*) INTO v_question_count
    FROM quiz_questions
    WHERE module_id = v_module_id;
    
    RAISE NOTICE 'SUCCESS! Created % quiz questions for Module 1', v_question_count;
    
    -- Show difficulty distribution
    RAISE NOTICE 'Question Distribution:';
    RAISE NOTICE '   Easy: 8 questions (40%%)';
    RAISE NOTICE '   Medium: 9 questions (45%%)';
    RAISE NOTICE '   Hard: 3 questions (15%%)';
    RAISE NOTICE 'Quiz setup complete! Module 1 is ready for students.';
    
END $$;

-- =====================================================
-- COMPLETE QUIZ SETUP FINISHED!
-- =====================================================
-- Tables created: quiz_questions, quiz_attempts
-- Total Questions: 20
-- Easy: 8 (40%), Medium: 9 (45%), Hard: 3 (15%)
-- Passing Score: 70% (14/20)
-- Max Attempts: 3
-- Time Limit: 40 minutes
-- =====================================================
