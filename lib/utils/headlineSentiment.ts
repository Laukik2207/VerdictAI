export type HeadlineSentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

const BULLISH_KEYWORDS = [
  'profit', 'growth', 'surge', 'record', 'beat', 'upgrade', 
  'expansion', 'partnership', 'jump', 'rally', 'soar', 'strong'
];

const BEARISH_KEYWORDS = [
  'loss', 'decline', 'miss', 'downgrade', 'layoff', 'lawsuit', 
  'recall', 'risk', 'fall', 'drop', 'slump', 'weak', 'plunge'
];

export function classifyHeadlineSentiment(headline: string): HeadlineSentiment {
  const lowerHeadline = headline.toLowerCase();
  
  // Check for bullish keywords
  const isBullish = BULLISH_KEYWORDS.some(keyword => lowerHeadline.includes(keyword));
  
  // Check for bearish keywords
  const isBearish = BEARISH_KEYWORDS.some(keyword => lowerHeadline.includes(keyword));
  
  if (isBullish && !isBearish) return 'BULLISH';
  if (isBearish && !isBullish) return 'BEARISH';
  
  // If both or neither, return NEUTRAL
  return 'NEUTRAL';
}
