import { Router, Request, Response } from 'express';
import { adminAuth } from '../middleware/auth';
import { logRefund, getRefundsByWallet, getRefundsByUser, getRefundStats } from '../services/refundService';
import { validateWalletAddress } from '../services/suiService';

const router = Router();

// Log a refund (public endpoint)
router.post('/log', async (req: Request, res: Response) => {
  try {
    const { walletAddress, amount, refundedBy, txHash } = req.body;

    if (!walletAddress || !amount || !refundedBy) {
      return res.status(400).json({
        success: false,
        error: 'wallet address, amount, and refundedBy are required'
      });
    }

    // Validate wallet address
    const validation = validateWalletAddress(walletAddress);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'amount must be a positive number'
      });
    }

    const refundRecord = await logRefund({
      walletAddress,
      amount,
      refundedBy,
      txHash
    });

    if (refundRecord) {
      res.json({
        success: true,
        message: 'refund logged successfully',
        refundId: refundRecord.id
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'failed to log refund'
      });
    }
  } catch (error) {
    console.error('Failed to log refund:', error);
    res.status(500).json({
      success: false,
      error: 'internal server error'
    });
  }
});

// Get refunds by wallet address
router.get('/wallet/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const refunds = await getRefundsByWallet(walletAddress);

    res.json({
      success: true,
      refunds
    });
  } catch (error) {
    console.error('Failed to get refunds by wallet:', error);
    res.status(500).json({
      success: false,
      error: 'internal server error'
    });
  }
});

router.get('/user/:refundedBy', async (req: Request, res: Response) => {
  try {
    const { refundedBy } = req.params;
    const refunds = await getRefundsByUser(refundedBy);

    res.json({
      success: true,
      refunds
    });
  } catch (error) {
    console.error('Failed to get refunds by user:', error);
    res.status(500).json({
      success: false,
      error: 'internal server error'
    });
  }
});

// Admin routes
router.use(adminAuth);

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await getRefundStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Failed to get refund stats:', error);
    res.status(500).json({
      success: false,
      error: 'internal server error'
    });
  }
});

export default router; 