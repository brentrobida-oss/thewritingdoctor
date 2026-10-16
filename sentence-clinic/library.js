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
      2019: {
        note: 'The last exam scored on the 9-point rubric; College Board rescored the samples on the current 6-point rubric.',
        q1: { topic: 'The most important factors in deciding whether to establish a commercial wind farm.', urls: [L('Questions', 'https://secure-media.collegeboard.org/apc/ap19-frq-english-language.pdf'), L('Current rubric applied to the 2019 questions', 'ap-english-language-2020-frq-scoring-guidelines-2019-exam-questions.pdf'), L('Q1 samples, current rubric', 'ap-english-language-2019-frq1-samples-2020-rubrics.pdf'), L('Q1 commentaries, current rubric', 'ap-english-language-2019-frq1-scoring-commentaries-2020-rubrics.pdf')] },
        q2: { topic: "Mohandas Gandhi's 1930 letter to Lord Irwin before the Salt March.", urls: [L('Sample responses and commentary (9-point)', 'ap19-apc-english-language-q2.pdf'), L('Q2 samples, current rubric', 'ap-english-language-2019-frq2-samples-2020-rubrics.pdf'), L('Q2 commentaries, current rubric', 'ap-english-language-2019-frq2-scoring-commentaries-2020-rubrics.pdf'), L('Questions', 'https://secure-media.collegeboard.org/apc/ap19-frq-english-language.pdf')] },
        q3: { topic: "Choose something commonly considered valuable that you judge 'overrated' and defend the judgment (secondary).", urls: [L('Sample responses and commentary (9-point)', 'ap19-apc-english-language-q3.pdf'), L('Q3 commentaries, current rubric', 'https://secure-media.collegeboard.org/ap/pdf/ap-english-language-and-composition-2019-frq3-scoring-commentaries-2020-rubrics.pdf'), L('Questions', 'https://secure-media.collegeboard.org/apc/ap19-frq-english-language.pdf')] }
      }
    },
    passages: []
  };
})(typeof self !== 'undefined' ? self : this);
