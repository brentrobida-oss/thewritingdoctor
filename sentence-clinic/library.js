/* The library: College Board AP English Language free-response materials, by year, as LINKS to the
   official PDFs, with a one-line description of each prompt in our own words. Passage text is
   included only where the passage is in the US public domain; otherwise the link is the passage.
   College Board's prompts, sample responses, and scoring commentaries are theirs; this file points
   to them and does not copy them.
   Provenance: the URLs were gathered from search listings pointing at apcentral.collegeboard.org and
   secure-media.collegeboard.org. The build sandbox could not open collegeboard.org, so none was
   fetched here; each opens at College Board, and a dead link means the file moved. The index page is
   the reliable starting point. Topic lines marked (secondary) rest on teacher sites, not the PDF. */
(function (root) {
  const CB = 'https://apcentral.collegeboard.org/media/pdf/';
  const L = (label, file) => ({ label, url: /^https?:/.test(file) ? file : CB + file, verified: false });
  root.APLibrary = {
    index: 'https://apcentral.collegeboard.org/courses/ap-english-language-and-composition/exam/past-exam-questions',
    ced: 'https://apcentral.collegeboard.org/pdf/ap-english-language-and-composition-course-and-exam-description.pdf',
    note: 'Links open at College Board. They were collected from search listings and not opened from the build sandbox; if one has moved, start from the index.',
    rubric: {
      structure: 'Each essay is scored 0 to 6: Row A Thesis (0 or 1), Row B Evidence and Commentary (0 to 4), Row C Sophistication (0 or 1).',
      rowA: { q1: 'Responds to the prompt with a thesis that presents a defensible position.', q2: "Responds to the prompt with a defensible thesis that analyzes the writer's rhetorical choices.", q3: 'Responds to the prompt with a thesis that presents a defensible position.' },
      rowB: {
        q1: ['References fewer than two sources, or restates the thesis or the prompt.', 'At least two sources; summarizes rather than explains.', 'At least three sources; explains how some evidence relates, but no line of reasoning.', 'Specific evidence from at least three sources for all claims; explains how some of it supports a line of reasoning.', 'Specific evidence from at least three sources for all claims; consistently explains how it supports a line of reasoning.'],
        q2: ['Restates the thesis or the prompt, or offers irrelevant information.', 'Mostly general evidence; summarizes rather than explains.', 'Some specific evidence; explains how some relates, but no line of reasoning.', 'Specific evidence for all claims; explains how at least one rhetorical choice contributes to the argument, purpose, or message.', 'Specific evidence for all claims; consistently explains how multiple rhetorical choices contribute to the argument, purpose, or message.'],
        q3: ['Restates the thesis or the prompt, or offers irrelevant information.', 'Mostly general evidence; summarizes rather than explains.', 'Some specific evidence; explains how some relates, but no line of reasoning.', 'Specific evidence for all claims; explains how some of it supports a line of reasoning.', 'Specific evidence for all claims; consistently explains how it supports a line of reasoning.']
      },
      rowC: 'Demonstrates sophistication of thought and/or a complex understanding of the rhetorical situation: tensions explored, implications or limitations situated in a broader context, choices that strengthen the argument throughout, a style consistently vivid and persuasive. Not earned by a phrase or a gesture: the complexity must be part of the argument.',
      provenance: 'Wording paraphrased from the College Board analytic rubric in use since fall 2019; check against the current scoring guidelines PDF.'
    },
    years: {
      2025: {
        note: 'Two sets released.',
        q1: { topic: 'Set 1: how nations and space agencies should weigh the factors in managing orbital debris (six sources). Set 2: the value, if any, of mapping software and GPS devices.', urls: [L('Questions, Set 2', 'ap25-frq-english-language-set-2.pdf'), L('Scoring guidelines, Set 1', 'ap25-sg-english-language-set-1.pdf'), L('Scoring guidelines, Set 2', 'ap25-sg-english-language-set-2.pdf'), L('Sample responses Q1, Set 1', 'ap25-apc-english-language-q1-set-1.pdf'), L('Chief reader report, Set 1', 'ap25-cr-report-english-language-set-1.pdf'), L('Chief reader report, Set 2', 'ap25-cr-report-english-language-set-2.pdf')] },
        q2: { topic: "Set 1: the introduction to David Treuer's Rez Life (2012) on Native Americans' contributions to the United States. Set 2: a New York Times essay by Vasquez Gilliland on going outside and engaging with the world.", urls: [L('Sample responses Q2, Set 1', 'ap25-apc-english-language-q2-set-1.pdf'), L('Sample responses Q2, Set 2', 'ap25-apc-english-language-q2-set-2.pdf'), L('Questions, Set 2', 'ap25-frq-english-language-set-2.pdf'), L('Scoring guidelines, Set 1', 'ap25-sg-english-language-set-1.pdf'), L('Scoring guidelines, Set 2', 'ap25-sg-english-language-set-2.pdf')] },
        q3: { topic: "Set 1: the extent to which Naomi Osaka's claim about staying present in each moment is valid. Set 2: the extent to which Amanda Gorman's claim about optimism and pessimism is valid.", urls: [L('Sample responses Q3, Set 1', 'ap25-apc-english-language-q3-set-1.pdf'), L('Sample responses Q3, Set 2', 'ap25-apc-english-language-q3-set-2.pdf'), L('Questions, Set 2', 'ap25-frq-english-language-set-2.pdf'), L('Scoring guidelines, Set 1', 'ap25-sg-english-language-set-1.pdf'), L('Scoring guidelines, Set 2', 'ap25-sg-english-language-set-2.pdf')] }
      },
      2024: {
        note: 'Two sets released.',
        q1: { topic: 'Set 1: whether laws protecting historic buildings are worthwhile. Set 2: the most important factors cities should weigh in regulating food trucks.', urls: [L('Questions, Set 1', 'ap24-frq-english-language-set-1.pdf'), L('Questions, Set 2', 'ap24-frq-english-language-set-2.pdf'), L('Scoring guidelines, Set 1', 'ap24-sg-english-language-set-1.pdf'), L('Scoring guidelines, Set 2', 'ap24-sg-english-language-set-2.pdf'), L('Sample responses Q1, Set 1', 'ap24-apc-english-language-q1-set-1.pdf'), L('Sample responses Q1, Set 2', 'ap24-apc-english-language-q1-set-2.pdf'), L('Chief reader report, Set 1', 'ap24-cr-report-english-language-set-1.pdf'), L('Chief reader report, Set 2', 'ap24-cr-report-english-language-set-2.pdf')] },
        q2: { topic: "Set 1: Reshma Saujani's essay on bravery from American Like Me (2018). Set 2: an excerpt from Simu Liu's 2022 memoir on his family's preparing to leave China.", urls: [L('Sample responses Q2, Set 1', 'ap24-apc-english-language-q2-set-1.pdf'), L('Sample responses Q2, Set 2', 'ap24-apc-english-language-q2-set-2.pdf'), L('Questions, Set 1', 'ap24-frq-english-language-set-1.pdf'), L('Questions, Set 2', 'ap24-frq-english-language-set-2.pdf'), L('Scoring guidelines, Set 1', 'ap24-sg-english-language-set-1.pdf'), L('Scoring guidelines, Set 2', 'ap24-sg-english-language-set-2.pdf')] },
        q3: { topic: "Set 1: the extent to which a writer's claim that selfies are a visual diary of a brief existence is valid. Set 2: the extent to which Jimmy Santiago Baca's claim about Americans' valuing of possessions is valid.", urls: [L('Sample responses Q3, Set 1', 'ap24-apc-english-language-q3-set-1.pdf'), L('Sample responses Q3, Set 2', 'ap24-apc-english-language-q3-set-2.pdf'), L('Questions, Set 1', 'ap24-frq-english-language-set-1.pdf'), L('Questions, Set 2', 'ap24-frq-english-language-set-2.pdf'), L('Scoring guidelines, Set 1', 'ap24-sg-english-language-set-1.pdf'), L('Scoring guidelines, Set 2', 'ap24-sg-english-language-set-2.pdf')] }
      },
      2023: {
        note: 'Two sets released; only Set 2 files were found by search. Start from the index for Set 1.',
        q1: { topic: 'Set 1: how worthwhile urban rewilding is for city communities. Set 2: the value of vertical farms to agriculture.', urls: [L('Questions, Set 2', 'ap23-frq-english-language-set-2.pdf')] },
        q2: { topic: "Set 1: Michelle Obama's final speech as First Lady, January 6, 2017 (secondary). Set 2: a commencement address by the poet Rita Dove on what she wishes for graduates.", urls: [L('Sample responses Q2, Set 2', 'ap23-apc-english-language-q2-set-2.pdf'), L('Questions, Set 2', 'ap23-frq-english-language-set-2.pdf')] },
        q3: { topic: "Set 1: the extent to which Maxine Hong Kingston's claim about a community of voices is valid (secondary). Set 2: the extent to which Carlos Curbelo's claim about persuading others is valid.", urls: [L('Sample responses Q3, Set 2', 'ap23-apc-english-language-q3-set-2.pdf'), L('Questions, Set 2', 'ap23-frq-english-language-set-2.pdf')] }
      },
      2022: {
        note: 'Single set. No file URL surfaced by search; use the index.',
        q1: { topic: 'Whether and how to prioritize STEM education initiatives.', urls: [] },
        q2: { topic: "Sonia Sotomayor's 2001 speech 'A Latina Judge's Voice' at Berkeley Law, on identity.", urls: [] },
        q3: { topic: "The extent to which Colin Powell's claim about making timely decisions is valid (secondary).", urls: [] }
      },
      2021: {
        note: 'Single set. Each sample-response file carries its scoring guideline.',
        q1: { topic: "The place, if any, of handwriting instruction in today's schools.", urls: [L('Sample responses and scoring guideline, Q1', 'ap21-apc-english-language-q1.pdf'), L('Chief reader report', 'ap21-chief-reader-report-english-language.pdf'), L('Questions (link seen only secondhand)', 'ap21-frq-english-language.pdf')] },
        q2: { topic: "Barack Obama's address dedicating the Rosa Parks statue in the Capitol, February 27, 2013.", urls: [L('Sample responses and scoring guideline, Q2', 'ap21-apc-english-language-q2.pdf'), L('Chief reader report', 'ap21-chief-reader-report-english-language.pdf')] },
        q3: { topic: 'The value of striving for perfection.', urls: [L('Sample responses and scoring guideline, Q3', 'ap21-apc-english-language-q3.pdf'), L('Chief reader report', 'ap21-chief-reader-report-english-language.pdf')] }
      },
      2020: {
        note: 'The 45-minute online exam had one question, a rhetorical analysis, in several passage versions. Three packets were released.',
        q2: { topic: "Packet 'Johnson': Lady Bird Johnson at the Eleanor Roosevelt Memorial Foundation luncheon. Packet 'Kennedy': Ronald Reagan's 1985 speech for the Kennedy Library. Packet 'Obama': Barack Obama's 2009 eulogy for Edward Kennedy. (Identifications secondary.)", urls: [L('Scoring guidelines, Johnson', 'ap20-english-language-and-composition-scoring-guidelines-D2-johnson.pdf'), L('Student samples, Johnson', 'ap20-english-language-and-composition-student-samples-johnson.pdf'), L('Scoring commentary, Johnson', 'ap20-english-language-and-composition-scoring-commentary-johnson.pdf'), L('Student samples, Kennedy', 'ap20-english-language-and-composition-student-samples-kennedy.pdf'), L('Student samples, Obama', 'ap20-english-language-and-composition-student-samples-obama.pdf'), L('Scoring guidelines, Obama', 'ap20-english-language-and-composition-scoring-guidelines-I2-obama.pdf'), L('Practice question (Condoleezza Rice, 2012)', 'ap-2020exam-sample-questions-english-language-and-composition.pdf')] }
      },
      2018: { note: 'Single set.', q2: { topic: "Madeleine Albright's commencement address at Mount Holyoke College, May 25, 1997, delivered as Secretary of State.", urls: [L('Questions', 'https://apcentral.collegeboard.org/pdf/ap18-frq-english-language.pdf')] } },
      2017: { note: 'Single set.', q2: { topic: "The opening of Clare Boothe Luce's 1960 speech to the Women's National Press Club, preparing journalists to be criticized.", urls: [L('Questions', 'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap-english-language-and-composition-frq-2017.pdf')] } },
      2016: { note: 'Single set.', q2: { topic: "Margaret Thatcher's 2004 eulogy for Ronald Reagan.", urls: [L('Questions', 'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap16_frq_english_language.pdf')] } },
      2015: { note: 'Single set.', q2: { topic: "Cesar Chavez's 1978 article on nonviolent resistance, written for the tenth anniversary of Martin Luther King Jr.'s death.", urls: [L('Questions', 'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap15_frq_english_language.pdf')] } },
      2014: { note: 'Single set.', q2: { topic: "Abigail Adams's letter of January 12, 1780, to her son John Quincy Adams, traveling in Europe with his father.", urls: [L('Questions', 'https://secure-media.collegeboard.org/digitalServices/pdf/ap/ap14_frq_english_language.pdf')] } },
      2019: {
        note: 'The last exam scored on the 9-point rubric; College Board rescored the samples on the current 6-point rubric.',
        q1: { topic: 'The most important factors in deciding whether to establish a commercial wind farm.', urls: [L('Questions', 'https://secure-media.collegeboard.org/apc/ap19-frq-english-language.pdf'), L('Current rubric applied to the 2019 questions', 'ap-english-language-2020-frq-scoring-guidelines-2019-exam-questions.pdf'), L('Q1 samples, current rubric', 'ap-english-language-2019-frq1-samples-2020-rubrics.pdf'), L('Q1 commentaries, current rubric', 'ap-english-language-2019-frq1-scoring-commentaries-2020-rubrics.pdf')] },
        q2: { topic: "Mohandas Gandhi's 1930 letter to Lord Irwin before the Salt March.", urls: [L('Sample responses and commentary (9-point)', 'ap19-apc-english-language-q2.pdf'), L('Q2 samples, current rubric', 'ap-english-language-2019-frq2-samples-2020-rubrics.pdf'), L('Q2 commentaries, current rubric', 'ap-english-language-2019-frq2-scoring-commentaries-2020-rubrics.pdf'), L('Questions', 'https://secure-media.collegeboard.org/apc/ap19-frq-english-language.pdf')] },
        q3: { topic: "Choose something commonly considered valuable that you judge 'overrated' and defend the judgment (secondary).", urls: [L('Sample responses and commentary (9-point)', 'ap19-apc-english-language-q3.pdf'), L('Q3 commentaries, current rubric', 'https://secure-media.collegeboard.org/ap/pdf/ap-english-language-and-composition-2019-frq3-scoring-commentaries-2020-rubrics.pdf'), L('Questions', 'https://secure-media.collegeboard.org/apc/ap19-frq-english-language.pdf')] }
      }
    },
    /* Q2 passages and their US public-domain status. pd:true passages may be shown in full; the text is
       loaded from text_source and pasted into the page by the teacher until it is filled in here (the build
       sandbox could not fetch any source). pd:false and 'unclear' passages are link-only. */
    passages: [
      { year: 2014, author: 'Abigail Adams', title: 'Letter to John Quincy Adams', date: 'January 12, 1780', pd: true, reason: 'Written 1780, published 1840.', text_source: 'https://founders.archives.gov/documents/Adams/04-03-02-0208', alt_source: 'https://www.masshist.org/digitaladams/archive/doc?id=L17800112aa', text: null, excerpt: 'The exam printed the letter nearly in full, from the dateline and "My dear Son".' },
      { year: 2015, author: 'Cesar Chavez', title: 'Article on nonviolent resistance', date: 'April 1978', pd: false, reason: 'Copyright held by the Chavez estate.' },
      { year: 2016, author: 'Margaret Thatcher', title: 'Eulogy for Ronald Reagan', date: 'June 11, 2004', pd: false, reason: 'Copyrighted; not a US government work.' },
      { year: 2017, author: 'Clare Boothe Luce', title: "Speech to the Women's National Press Club", date: '1960', pd: false, reason: 'Private citizen in 1960; assume copyrighted.' },
      { year: 2018, author: 'Madeleine Albright', title: 'Commencement address, Mount Holyoke College', date: 'May 25, 1997', pd: true, reason: 'Remarks of a sitting Secretary of State, released by the Department of State as official remarks (17 USC 105). A commencement address sits at the edge of official duties; treat as link-only if you want zero risk.', text_source: 'https://1997-2001.state.gov/statements/970525.html', text: null, excerpt: 'The exam printed roughly 700 words from the middle of the address.' },
      { year: 2019, author: 'Mohandas K. Gandhi', title: 'Letter to Lord Irwin', date: 'March 2, 1930', pd: true, reason: 'Published 1930 in Young India; US term expired at the end of 2025.', text_source: 'https://www.mkgandhi.org/famous_letters/gandhi_lord_irwin.php', text: null, excerpt: 'The exam printed an abridged excerpt beginning "Dear Friend, Before embarking on civil disobedience".' },
      { year: 2020, author: 'Ronald Reagan', title: 'Remarks at a fundraising dinner for the John F. Kennedy Library Foundation (form "Kennedy")', date: 'June 24, 1985', pd: true, reason: 'Official remarks of a sitting President; Public Papers of the Presidents.', text_source: 'https://www.reaganlibrary.gov/archives/speech/remarks-fundraising-dinner-john-f-kennedy-library-foundation-boston-massachusetts', text: null, excerpt: 'The exam used an excerpt of the tribute, roughly 600 to 700 words.' },
      { year: 2020, author: 'Barack Obama', title: 'Eulogy for Senator Edward M. Kennedy (form "Obama")', date: 'August 29, 2009', pd: true, reason: 'Official remarks of a sitting President, released by the White House.', text_source: 'https://obamawhitehouse.archives.gov/the-press-office/remarks-president-memorial-service-senator-edward-kennedy', text: null },
      { year: 2020, author: "Claudia 'Lady Bird' Johnson", title: 'Speech at the Eleanor Roosevelt Memorial Foundation luncheon (form "Johnson")', date: 'April 9, 1964', pd: 'unclear', reason: 'A First Lady is not a federal officer or employee, so the government-work rule does not clearly apply.' },
      { year: 2021, author: 'Barack Obama', title: 'Remarks at the dedication of the Rosa Parks statue, National Statuary Hall', date: 'February 27, 2013', pd: true, reason: 'Official remarks of a sitting President, released by the White House.', text_source: 'https://obamawhitehouse.archives.gov/the-press-office/2013/02/27/remarks-president-dedication-statue-honoring-rosa-parks-us-capitol', text: null, excerpt: 'The exam printed nearly the full address, after the opening acknowledgments.' },
      { year: 2022, author: 'Sonia Sotomayor', title: "'A Latina Judge's Voice', Olmos Memorial Lecture, Berkeley Law", date: 'October 26, 2001', pd: 'unclear', reason: 'An extrajudicial lecture published by a privately run law journal; assume copyrighted.' },
      { year: 2023, author: 'Michelle Obama', title: 'Final remarks as First Lady, School Counselor of the Year event (Set 1)', date: 'January 6, 2017', pd: 'unclear', reason: 'A First Lady is not a federal officer or employee.' },
      { year: 2023, author: 'Rita Dove', title: 'Commencement address, University of Virginia (Set 2)', date: 'May 21, 2016', pd: false, reason: 'Copyrighted.' },
      { year: 2024, author: 'Reshma Saujani', title: 'Essay in American Like Me (Set 1)', date: '2018', pd: false, reason: 'Copyrighted.' },
      { year: 2024, author: 'Simu Liu', title: 'We Were Dreamers (Set 2)', date: '2022', pd: false, reason: 'Copyrighted.' },
      { year: 2025, author: 'David Treuer', title: 'Introduction to Rez Life (Set 1)', date: '2012', pd: false, reason: 'Copyrighted.' },
      { year: 2025, author: 'Raquel Vasquez Gilliland', title: "'Go Outside, Sink Your Feet Into the Dirt and Engage With the World' (Set 2)", date: '2023', pd: false, reason: 'Copyrighted.' }
    ]
  };
})(typeof self !== 'undefined' ? self : this);
