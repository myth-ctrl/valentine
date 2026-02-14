
export interface WishState {
  recipient: string;
  message: string;
  videoSrc: string | null;
}

export enum MessageTone {
  ROMANTIC = 'Romantic',
  FUNNY = 'Funny',
  POETIC = 'Poetic',
  CASUAL = 'Casual'
}
