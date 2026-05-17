-- Lexora seed: B2-C1 Starter Vocabulary (30 words)
-- Run this AFTER 001_initial_schema.sql

-- ============================================
-- Step 1: Insert 30 words
-- ============================================
INSERT INTO public.words (word, pos, pronunciation, meaning_en, meaning_tr, example_en, example_tr, level, source) VALUES
-- B2 (15)
('achieve', 'verb', '/əˈtʃiːv/', 'to successfully reach a goal through effort', 'başarmak, ulaşmak', 'She achieved her dream of becoming a doctor.', 'Doktor olma hayaline ulaştı.', 'B2', 'CAE Starter'),
('acknowledge', 'verb', '/əkˈnɒlɪdʒ/', 'to accept or admit that something is true', 'kabul etmek, onaylamak', 'He acknowledged that he had made a mistake.', 'Hata yaptığını kabul etti.', 'B2', 'CAE Starter'),
('acquire', 'verb', '/əˈkwaɪər/', 'to get or obtain something', 'edinmek, kazanmak', 'She acquired fluency in three languages.', 'Üç dilde akıcılık kazandı.', 'B2', 'CAE Starter'),
('beneficial', 'adjective', '/ˌbenɪˈfɪʃəl/', 'producing good results or helpful effects', 'faydalı, yararlı', 'Regular exercise is beneficial to your health.', 'Düzenli egzersiz sağlığa faydalıdır.', 'B2', 'CAE Starter'),
('capable', 'adjective', '/ˈkeɪpəbəl/', 'able to do something well', 'yetenekli, muktedir', 'She is capable of handling difficult situations.', 'Zor durumlarla baş edebilecek yetenektedir.', 'B2', 'CAE Starter'),
('consequence', 'noun', '/ˈkɒnsɪkwəns/', 'a result of an action or situation', 'sonuç, netice', 'Climate change is a consequence of human activity.', 'İklim değişikliği insan faaliyetinin sonucudur.', 'B2', 'CAE Starter'),
('demonstrate', 'verb', '/ˈdemənstreɪt/', 'to show clearly that something exists or is true', 'göstermek, kanıtlamak', 'The study demonstrates a clear link between diet and health.', 'Çalışma, beslenme ve sağlık arasında net bir bağ olduğunu gösteriyor.', 'B2', 'CAE Starter'),
('emphasize', 'verb', '/ˈemfəsaɪz/', 'to give special importance to something', 'vurgulamak, önem vermek', 'The teacher emphasized the importance of practice.', 'Öğretmen pratiğin önemini vurguladı.', 'B2', 'CAE Starter'),
('enhance', 'verb', '/ɪnˈhɑːns/', 'to improve the quality or value of something', 'geliştirmek, artırmak', 'The new software enhances productivity.', 'Yeni yazılım üretkenliği artırıyor.', 'B2', 'CAE Starter'),
('ensure', 'verb', '/ɪnˈʃʊər/', 'to make certain that something happens', 'sağlamak, garanti etmek', 'Please ensure all windows are closed before leaving.', 'Lütfen ayrılmadan önce tüm pencerelerin kapalı olduğundan emin olun.', 'B2', 'CAE Starter'),
('estimate', 'verb', '/ˈestɪmeɪt/', 'to roughly calculate or judge', 'tahmin etmek', 'Experts estimate the cost at over a million dollars.', 'Uzmanlar maliyeti bir milyon doların üzerinde tahmin ediyor.', 'B2', 'CAE Starter'),
('evident', 'adjective', '/ˈevɪdənt/', 'clearly seen or understood; obvious', 'belli, açık, aşikar', 'It was evident that she was tired.', 'Yorgun olduğu açıkça belliydi.', 'B2', 'CAE Starter'),
('genuine', 'adjective', '/ˈdʒenjuɪn/', 'real, sincere, not fake', 'gerçek, samimi, hakiki', 'She had a genuine interest in helping others.', 'Başkalarına yardım etme konusunda gerçek bir ilgisi vardı.', 'B2', 'CAE Starter'),
('reluctant', 'adjective', '/rɪˈlʌktənt/', 'unwilling and hesitant', 'isteksiz, gönülsüz', 'He was reluctant to admit he was wrong.', 'Hatalı olduğunu kabul etmek konusunda isteksizdi.', 'B2', 'CAE Starter'),
('reveal', 'verb', '/rɪˈviːl/', 'to make known something previously secret or unknown', 'açığa çıkarmak, ifşa etmek', 'The study reveals surprising results.', 'Çalışma şaşırtıcı sonuçları açığa çıkarıyor.', 'B2', 'CAE Starter'),

-- C1 (15)
('alleviate', 'verb', '/əˈliːvieɪt/', 'to make pain or problems less severe', 'hafifletmek, azaltmak', 'The new policy aims to alleviate poverty.', 'Yeni politika yoksulluğu hafifletmeyi amaçlıyor.', 'C1', 'CAE Starter'),
('ambiguous', 'adjective', '/æmˈbɪɡjuəs/', 'having more than one possible meaning; unclear', 'belirsiz, çok anlamlı', 'His answer was deliberately ambiguous.', 'Cevabı kasten belirsizdi.', 'C1', 'CAE Starter'),
('coherent', 'adjective', '/kəʊˈhɪərənt/', 'logical and well-organized', 'tutarlı, mantıklı', 'She presented a coherent argument.', 'Tutarlı bir argüman sundu.', 'C1', 'CAE Starter'),
('compelling', 'adjective', '/kəmˈpelɪŋ/', 'powerful and convincing; difficult to ignore', 'ikna edici, çekici', 'The book offers a compelling story about resilience.', 'Kitap, dayanıklılık hakkında ikna edici bir hikaye sunuyor.', 'C1', 'CAE Starter'),
('contemplate', 'verb', '/ˈkɒntəmpleɪt/', 'to think about something carefully for a long time', 'derinden düşünmek, tefekkür etmek', 'She contemplated leaving her job to travel.', 'Seyahat etmek için işinden ayrılmayı uzun uzun düşündü.', 'C1', 'CAE Starter'),
('discern', 'verb', '/dɪˈsɜːn/', 'to perceive or recognize something subtle', 'fark etmek, ayırt etmek', 'It''s hard to discern his true intentions.', 'Gerçek niyetlerini ayırt etmek zor.', 'C1', 'CAE Starter'),
('elaborate', 'verb', '/ɪˈlæbəreɪt/', 'to explain something in more detail', 'detaylandırmak, ayrıntılı anlatmak', 'Could you elaborate on your proposal?', 'Teklifini biraz daha detaylandırabilir misin?', 'C1', 'CAE Starter'),
('endure', 'verb', '/ɪnˈdjʊər/', 'to suffer something painful or difficult patiently', 'dayanmak, tahammül etmek', 'They had to endure harsh winters in the mountains.', 'Dağlarda sert kışlara dayanmak zorunda kaldılar.', 'C1', 'CAE Starter'),
('inherent', 'adjective', '/ɪnˈhɪərənt/', 'existing as a natural or essential part of something', 'doğasında olan, içkin', 'Risk is inherent in any investment.', 'Risk her yatırımın doğasında vardır.', 'C1', 'CAE Starter'),
('mitigate', 'verb', '/ˈmɪtɪɡeɪt/', 'to make less severe or harmful', 'yumuşatmak, hafifletmek', 'We must take action to mitigate climate change.', 'İklim değişikliğini hafifletmek için harekete geçmeliyiz.', 'C1', 'CAE Starter'),
('plausible', 'adjective', '/ˈplɔːzəbəl/', 'seeming reasonable or believable', 'akla yatkın, makul', 'That''s a plausible explanation, but I''m not convinced.', 'Akla yatkın bir açıklama ama ben ikna olmadım.', 'C1', 'CAE Starter'),
('profound', 'adjective', '/prəˈfaʊnd/', 'very great, intense, or deep', 'derin, engin', 'Her speech had a profound impact on the audience.', 'Konuşması izleyici üzerinde derin bir etki bıraktı.', 'C1', 'CAE Starter'),
('scrutinize', 'verb', '/ˈskruːtɪnaɪz/', 'to examine carefully and thoroughly', 'titizlikle incelemek, irdelemek', 'The auditor scrutinized every transaction.', 'Denetçi her işlemi titizlikle inceledi.', 'C1', 'CAE Starter'),
('substantial', 'adjective', '/səbˈstænʃəl/', 'large in size, value, or importance', 'önemli, büyük, kayda değer', 'They made a substantial contribution to the project.', 'Projeye önemli bir katkı yaptılar.', 'C1', 'CAE Starter'),
('viable', 'adjective', '/ˈvaɪəbəl/', 'capable of working successfully; feasible', 'uygulanabilir, yapılabilir', 'Solar power has become a viable alternative.', 'Güneş enerjisi uygulanabilir bir alternatif haline geldi.', 'C1', 'CAE Starter')
ON CONFLICT (word) DO NOTHING;

-- ============================================
-- Step 2: Create starter deck
-- ============================================
INSERT INTO public.decks (id, name, description, level, is_public)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'CAE Starter Vocabulary',
  '30 temel B2-C1 kelimesiyle başla. Cambridge sınavları için kritik akademik kelimeler.',
  'C1',
  true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Step 3: Add all starter words to the deck
-- ============================================
INSERT INTO public.deck_words (deck_id, word_id, position)
SELECT
  '00000000-0000-0000-0000-000000000001'::uuid,
  w.id,
  row_number() OVER (ORDER BY w.level, w.word)
FROM public.words w
WHERE w.source = 'CAE Starter'
ON CONFLICT (deck_id, word_id) DO NOTHING;
