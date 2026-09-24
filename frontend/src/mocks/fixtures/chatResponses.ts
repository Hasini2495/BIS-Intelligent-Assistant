

export const chatResponsesFixture = {
  concrete: {
    status: 'grounded',
    answerMarkdown: 'IS 456 is the standard for plain and reinforced concrete.',
    relevantStandards: [],
    evidence: [],
    sources: [],
    relatedQuestions: ['What is the testing method for concrete?'],
    disclaimerKeys: ['guidance'],
    generatedAt: new Date().toISOString(),
    isDemoData: true
  },
  water: {
    status: 'grounded',
    answerMarkdown: 'IS 10500 is the standard for drinking water.',
    relevantStandards: [],
    evidence: [],
    sources: [],
    relatedQuestions: ['How is water tested?'],
    disclaimerKeys: ['guidance'],
    generatedAt: new Date().toISOString(),
    isDemoData: true
  },
  hallmarking: {
    status: 'grounded',
    answerMarkdown: 'Hallmarking provides assurance of purity of gold.',
    relevantStandards: [],
    evidence: [],
    sources: [],
    relatedQuestions: ['What is HUID?'],
    disclaimerKeys: ['guidance'],
    generatedAt: new Date().toISOString(),
    isDemoData: true
  },
  certification: {
    status: 'grounded',
    answerMarkdown: 'ISI Mark certification ensures product quality.',
    relevantStandards: [],
    evidence: [],
    sources: [],
    relatedQuestions: ['How to apply for ISI mark?'],
    disclaimerKeys: ['guidance'],
    generatedAt: new Date().toISOString(),
    isDemoData: true
  },
  earthquake: {
    status: 'grounded',
    answerMarkdown: 'IS 1893 provides criteria for earthquake resistant design.',
    relevantStandards: [],
    evidence: [],
    sources: [],
    relatedQuestions: ['What are the seismic zones?'],
    disclaimerKeys: ['guidance'],
    generatedAt: new Date().toISOString(),
    isDemoData: true
  },
  default: {
    status: 'insufficient_evidence',
    answerMarkdown: 'I could not find sufficient information to answer your query.',
    relevantStandards: [],
    evidence: [],
    sources: [],
    relatedQuestions: [],
    disclaimerKeys: ['guidance'],
    generatedAt: new Date().toISOString(),
    isDemoData: true
  }
};
