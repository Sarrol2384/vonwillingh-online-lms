-- ============================================================
-- FINAL PRECISE REMOVAL - Remove ONLY Plain-Text Quiz
-- ============================================================
-- This removes the embedded plain-text quiz questions while
-- preserving ALL educational content and the interactive quiz.
-- ============================================================

DO $$
DECLARE
    v_module_id UUID;
    v_content TEXT;
    v_cut_position INT;
    v_original_length INT;
    v_new_length INT;
BEGIN
    -- Get Module 1
    SELECT m.id, m.content INTO v_module_id, v_content
    FROM modules m
    JOIN courses c ON m.course_id = c.id
    WHERE c.code = 'AIFUND001' AND m.title ILIKE '%Module 1%';
    
    IF v_module_id IS NULL THEN
        RAISE EXCEPTION 'Module 1 not found!';
    END IF;
    
    v_original_length := LENGTH(v_content);
    RAISE NOTICE 'Module 1 ID: %', v_module_id;
    RAISE NOTICE 'Original content length: % bytes', v_original_length;
    
    -- Find the exact start of the plain-text quiz
    -- Looking for the Key Research Paper section which comes BEFORE the quiz
    v_cut_position := POSITION('Key Research Paper' IN v_content);
    
    IF v_cut_position = 0 THEN
        RAISE EXCEPTION 'Could not find marker for quiz removal';
    END IF;
    
    -- Move forward to the end of the Key Research Paper section
    -- Look for the closing </div> after the research paper content
    v_cut_position := POSITION('The authors demonstrate how SMEs with limited' IN v_content);
    
    IF v_cut_position > 0 THEN
        -- Move to after this paragraph (about 400 characters forward)
        v_cut_position := v_cut_position + 400;
        
        -- Now find the next major section break or quiz start
        -- Look for the table or the first quiz question
        DECLARE
            v_temp_pos INT;
        BEGIN
            -- Try to find the Industry table (this comes after educational content)
            v_temp_pos := POSITION('<table' IN SUBSTRING(v_content, v_cut_position, 50000));
            
            IF v_temp_pos > 0 THEN
                v_cut_position := v_cut_position + v_temp_pos - 1;
                RAISE NOTICE 'Found table at position: %', v_cut_position;
            ELSE
                -- If no table, look for plain-text quiz question pattern
                v_temp_pos := POSITION('<p style="margin: 10px 0; font-size: 16px;"><strong>1.' 
                    IN SUBSTRING(v_content, v_cut_position, 50000));
                
                IF v_temp_pos > 0 THEN
                    v_cut_position := v_cut_position + v_temp_pos - 1;
                    RAISE NOTICE 'Found quiz at position: %', v_cut_position;
                END IF;
            END IF;
        END;
    END IF;
    
    RAISE NOTICE 'Cutting content at position: %', v_cut_position;
    RAISE NOTICE 'Content around cut (200 chars before): %', 
        SUBSTRING(v_content, v_cut_position - 200, 200);
    
    -- Ask for confirmation
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'REVIEW THE CONTENT ABOVE BEFORE PROCEEDING';
    RAISE NOTICE 'If it looks correct, uncomment the UPDATE below';
    RAISE NOTICE '===============================================';
    
    -- UNCOMMENT THIS AFTER REVIEWING THE OUTPUT:
    /*
    UPDATE modules
    SET content = SUBSTRING(v_content, 1, v_cut_position),
        updated_at = NOW()
    WHERE id = v_module_id;
    
    v_new_length := LENGTH(SUBSTRING(v_content, 1, v_cut_position));
    RAISE NOTICE 'New content length: % bytes', v_new_length;
    RAISE NOTICE 'Removed: % bytes', (v_original_length - v_new_length);
    RAISE NOTICE '✅ Removal complete!';
    */
    
END $$;
