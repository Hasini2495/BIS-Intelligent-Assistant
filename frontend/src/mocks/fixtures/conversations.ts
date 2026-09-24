export const conversationsFixture = [
  { id: 'conv-1', title: 'Concrete standards', language: 'en', messageCount: 4, isArchived: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'conv-2', title: 'Hallmarking query', language: 'en', messageCount: 2, isArchived: false, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'conv-3', title: 'Drinking water IS', language: 'en', messageCount: 6, isArchived: false, createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'conv-4', title: 'ISI mark process', language: 'en', messageCount: 2, isArchived: false, createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date(Date.now() - 604800000).toISOString() },
  { id: 'conv-5', title: 'Seismic design', language: 'en', messageCount: 8, isArchived: true, createdAt: new Date(Date.now() - 2592000000).toISOString(), updatedAt: new Date(Date.now() - 2592000000).toISOString() }
];
