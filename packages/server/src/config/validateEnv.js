/**
 * Environment Variable Validation
 *
 * This module validates that all required environment variables are present
 * before the application starts. This prevents runtime errors due to missing config.
 */

export function validateEnv() {
    // Required environment variables for all environments
    const required = [
        'DATABASE_URL',
        'JWT_SECRET',
        'CLIENT_URL',
    ];

    // Check for missing required variables
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(key => console.error(`   - ${key}`));
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Production-specific validations
    if (process.env.NODE_ENV === 'production') {
        // Ensure JWT_SECRET is not the default development value
        if (process.env.JWT_SECRET === 'dev_secret_change_me' || process.env.JWT_SECRET === 'your-secret-key') {
            throw new Error('❌ JWT_SECRET must be changed from default value in production!');
        }

        // Ensure JWT_SECRET is strong enough (at least 32 characters)
        if (process.env.JWT_SECRET.length < 32) {
            throw new Error('❌ JWT_SECRET must be at least 32 characters long in production!');
        }

        // Warn if SMTP is not configured (email verification won't work)
        const smtpVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
        const missingSMTP = smtpVars.filter(key => !process.env[key]);

        if (missingSMTP.length > 0) {
            console.warn('⚠️  SMTP not fully configured. Email verification will not work.');
            console.warn('   Missing:', missingSMTP.join(', '));
        }
    }

    // Success message
    console.log('✅ Environment variables validated successfully');

    // Log environment info (without sensitive values)
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   DATABASE: ${process.env.DATABASE_URL?.includes('postgres') ? 'PostgreSQL' : 'SQLite'}`);
    console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}`);
}
