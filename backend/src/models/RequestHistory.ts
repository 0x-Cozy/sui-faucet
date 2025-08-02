import { Schema, model, Document } from 'mongoose';

export interface IRequestHistory extends Document {
  walletAddress: string;
  amount: number;
  source: 'frontend' | 'discord';
  discordUserId?: string;
  ip?: string;
  txHash?: string;
  success: boolean;
  error?: string;
  timestamp: Date;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
    blocked: boolean;
  };
}

const RequestHistorySchema = new Schema<IRequestHistory>({
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['frontend', 'discord'],
    required: true
  },
  discordUserId: {
    type: String,
    required: false,
    index: true
  },
  ip: {
    type: String,
    required: false
  },
  txHash: {
    type: String,
    required: false
  },
  success: {
    type: Boolean,
    required: true
  },
  error: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  rateLimitInfo: {
    remaining: Number,
    resetTime: Number,
    blocked: Boolean
  }
});

//index for better query performance
RequestHistorySchema.index({ walletAddress: 1, timestamp: -1 });
RequestHistorySchema.index({ discordUserId: 1, timestamp: -1 });
RequestHistorySchema.index({ source: 1, timestamp: -1 });
RequestHistorySchema.index({ success: 1, timestamp: -1 });

export const RequestHistory = model<IRequestHistory>('RequestHistory', RequestHistorySchema); 