-- ============================================================
-- STEP 1: Unlink profiles that reference these voters
--         (nullify FK before delete to avoid constraint violation)
-- ============================================================
UPDATE profiles
SET
  linked_voter_id     = NULL,
  is_voter_verified   = FALSE,
  state               = NULL,
  constituency_mp     = NULL,
  constituency_mla    = NULL
WHERE linked_voter_id IN (
  '3d47c3a8-5bd8-428e-804b-bb3c7b8f45ef', -- Rahul Deshmukh
  '71d94976-9263-4350-8722-cbdb76ad3d5d', -- Vikram Singh
  '9124654d-6b28-4736-9443-242ab1a07204', -- Arjun Nair
  '9b95535f-6cf7-4d66-80a6-360ea76931bd', -- Priya Singh
  'fa945baf-266b-481b-8063-09da7b932493'  -- Swapna Mukherjee
);

-- Also unlink the voters table's own back-reference to profiles
UPDATE voters
SET linked_profile_id = NULL
WHERE id IN (
  '3d47c3a8-5bd8-428e-804b-bb3c7b8f45ef',
  '71d94976-9263-4350-8722-cbdb76ad3d5d',
  '9124654d-6b28-4736-9443-242ab1a07204',
  '9b95535f-6cf7-4d66-80a6-360ea76931bd',
  'fa945baf-266b-481b-8063-09da7b932493'
);

-- ============================================================
-- STEP 2: Now safe to delete voters with no matching candidates
-- Affected: Rahul Deshmukh (Pune), Vikram Singh (Jaipur),
--           Arjun Nair (Thiruvananthapuram), Priya Singh (Patna),
--           Swapna Mukherjee (Kolkata South / Ballygunge)
-- ============================================================
DELETE FROM voters WHERE id IN (
  '3d47c3a8-5bd8-428e-804b-bb3c7b8f45ef', -- Rahul Deshmukh    (Pune / Pune Central)
  '71d94976-9263-4350-8722-cbdb76ad3d5d', -- Vikram Singh      (Jaipur / Jaipur Central)
  '9124654d-6b28-4736-9443-242ab1a07204', -- Arjun Nair        (Thiruvananthapuram / City North)
  '9b95535f-6cf7-4d66-80a6-360ea76931bd', -- Priya Singh       (Patna Sahib / Patna Central)
  'fa945baf-266b-481b-8063-09da7b932493'  -- Swapna Mukherjee  (Kolkata South / Ballygunge)
);

-- ============================================================
-- STEP 3: Insert new voters — 2 per valid state (14 total)
-- Valid states & constituencies from candidates table:
--   Uttar Pradesh : MP=Varanasi,        MLA=Varanasi South
--   Gujarat       : MP=Ahmedabad West,  MLA=Ellis Bridge
--   Delhi         : MP=New Delhi,       MLA=New Delhi
--   Tamil Nadu    : MP=Chennai North,   MLA=Royapuram
--   Karnataka     : MP=Bangalore South, MLA=Jayanagar
--   Maharashtra   : MP=Mumbai South,    MLA=Colaba
--   West Bengal   : MP=Kolkata North,   MLA=Shyampukur
-- ============================================================

INSERT INTO voters (voter_id_epic, aadhar_number, full_name, phone_number, age, gender, state, district, constituency_mp, constituency_mla)
VALUES

-- ── Uttar Pradesh ──────────────────────────────────────────
('UPV1001001', '112233445566', 'Amit Verma',         '9011001001', 38, 'Male',   'Uttar Pradesh', 'Varanasi',   'Varanasi',        'Varanasi South'),
('UPV1001002', '223344556677', 'Sunita Yadav',        '9011001002', 29, 'Female', 'Uttar Pradesh', 'Varanasi',   'Varanasi',        'Varanasi South'),

-- ── Gujarat ────────────────────────────────────────────────
('GJA1002001', '334455667788', 'Hardik Patel',        '9022002001', 33, 'Male',   'Gujarat',       'Ahmedabad',  'Ahmedabad West',  'Ellis Bridge'),
('GJA1002002', '445566778899', 'Hetal Shah',          '9022002002', 26, 'Female', 'Gujarat',       'Ahmedabad',  'Ahmedabad West',  'Ellis Bridge'),

-- ── Delhi ──────────────────────────────────────────────────
('DLN1003001', '556677889900', 'Rohit Kapoor',        '9033003001', 41, 'Male',   'Delhi',         'New Delhi',  'New Delhi',       'New Delhi'),
('DLN1003002', '667788990011', 'Pooja Mehta',         '9033003002', 31, 'Female', 'Delhi',         'New Delhi',  'New Delhi',       'New Delhi'),

-- ── Tamil Nadu ─────────────────────────────────────────────
('TNC1004001', '778899001122', 'Karthik Rajan',       '9044004001', 36, 'Male',   'Tamil Nadu',    'Chennai',    'Chennai North',   'Royapuram'),
('TNC1004002', '889900112233', 'Divya Krishnan',      '9044004002', 27, 'Female', 'Tamil Nadu',    'Chennai',    'Chennai North',   'Royapuram'),

-- ── Karnataka ──────────────────────────────────────────────
('KRB1005001', '990011223344', 'Naveen Kumar',        '9055005001', 44, 'Male',   'Karnataka',     'Bangalore',  'Bangalore South', 'Jayanagar'),
('KRB1005002', '100122334455', 'Rekha Shetty',        '9055005002', 30, 'Female', 'Karnataka',     'Bangalore',  'Bangalore South', 'Jayanagar'),

-- ── Maharashtra ────────────────────────────────────────────
('MHM1006001', '211233445566', 'Sagar Patil',         '9066006001', 39, 'Male',   'Maharashtra',   'Mumbai',     'Mumbai South',    'Colaba'),
('MHM1006002', '322344556677', 'Sneha Joshi',         '9066006002', 25, 'Female', 'Maharashtra',   'Mumbai',     'Mumbai South',    'Colaba'),

-- ── West Bengal ────────────────────────────────────────────
('WBK1007001', '433455667788', 'Debashish Roy',       '9077007001', 47, 'Male',   'West Bengal',   'Kolkata',    'Kolkata North',   'Shyampukur'),
('WBK1007002', '544566778899', 'Puja Banerjee',       '9077007002', 28, 'Female', 'West Bengal',   'Kolkata',    'Kolkata North',   'Shyampukur');

-- ============================================================
-- STEP 4: Verify final voter list
-- ============================================================
SELECT
  voter_id_epic,
  full_name,
  state,
  constituency_mp,
  constituency_mla,
  LENGTH(voter_id_epic)   AS epic_len,
  voter_id_epic ~ '^[A-Z]{3}[0-9]{7}$' AS epic_valid,
  LENGTH(aadhar_number)   AS aadhar_len
FROM voters
ORDER BY state, full_name;
