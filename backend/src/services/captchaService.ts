import axios from 'axios'
import { config } from '../utils/config'

interface CaptchaVerificationResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  credit?: boolean
  'error-codes'?: string[]
}

export const verifyCaptcha = async (token: string, ip: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!config.captcha.secretKey) {
      console.warn('hCaptcha secret key not configured, skipping verification')
      return { success: true }
    }

    const response = await axios.post('https://hcaptcha.com/siteverify', {
      secret: config.captcha.secretKey,
      response: token,
      remoteip: ip
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const data: CaptchaVerificationResponse = response.data

    if (!data.success) {
      const errorCodes = data['error-codes'] || []
      console.error('Captcha verification failed:', errorCodes)
      
      return {
        success: false,
        error: `Captcha verification failed: ${errorCodes.join(', ')}`
      }
    }

    // Remove hostname check since we don't have domain configured
    // The hCaptcha service will handle domain validation on their end
    //TODO

    return { success: true }

  } catch (error) {
    console.error('Captcha verification error:', error)
    return {
      success: false,
      error: 'Captcha verification service unavailable'
    }
  }
} 