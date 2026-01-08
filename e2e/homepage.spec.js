const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/PrepWise/i);
  });

  test('should display the main heading', async ({ page }) => {
    await page.goto('/');
    
    // Check for the presence of a heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for common navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});
