const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load and check for main heading
    await page.waitForLoadState('networkidle');
    
    // Check for the main heading that appears on the landing page
    await expect(page.locator('h1')).toContainText('Ace Your Next');
  });

  test('should display the CTA button', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Check for the Google sign-in button
    const signInButton = page.getByRole('button', { name: /Get Started with Google/i });
    await expect(signInButton).toBeVisible();
  });

  test('should display features section', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page load
    await page.waitForLoadState('networkidle');
    
    // Check for features section heading
    const featuresHeading = page.locator('text=Everything you need to succeed');
    await expect(featuresHeading).toBeVisible();
    
    // Check that feature cards are present by looking for the feature heading with specific class
    await expect(page.locator('.text-lg.leading-6.font-medium.text-gray-900', { hasText: 'Mock Interviews' })).toBeVisible();
    await expect(page.locator('.text-lg.leading-6.font-medium.text-gray-900', { hasText: 'Progress Tracking' })).toBeVisible();
  });
});
