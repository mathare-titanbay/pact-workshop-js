import { test, expect } from '@playwright/test'
import { transformPlaywrightMatchToPact } from '../src/playwrightSerialiser'

const consumer = 'FrontendPW'
const provider = 'ProductService'
const apiBaseUrl = 'http://localhost:8080'
const productData = [
  {
      "id": "09",
      "type": "CREDIT_CARD",
      "name": "Gem Visa",
      "version": "v1"
  },
  {
      "id": "10",
      "type": "CREDIT_CARD",
      "name": "28 Degrees",
      "version": "v1"
  },
  {
      "id": "11",
      "type": "PERSONAL_LOAN",
      "name": "MyFlexiPay",
      "version": "v2"
  }
]

test.describe("API Pact test", () => {
  test.describe("products exist", () => {
    test("get all products", async ({page}, testInfo) => {
      
      await page.route(apiBaseUrl + '/products', async (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(productData),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        await transformPlaywrightMatchToPact(route, testInfo, { consumer, provider })
        return
      })

      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      await page.waitForTimeout(1000)
    })

    // No auth token - how to send request without it & get Playwright to mock the response?
    // Do I need to send the request directly with Playwright rather than interacting with the UI?
  })
  
  test.describe("no products exist", () => {
    test("get all products when none exist", async({page}, testInfo) => {
      await page.route(apiBaseUrl + '/products', async (route) => {
        route.fulfill({
          status: 200,
          body: '[]',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        await transformPlaywrightMatchToPact(route, testInfo, { consumer, provider })
        return
      })

      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      await page.waitForTimeout(1000)  

    })
  })

  test.describe("product with ID 10 exists", () => {
    test("get product with ID 10", async({page}, testInfo) => {
      await page.route(apiBaseUrl + '/product/10', async (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({
            id: "10",
            type: "CREDIT_CARD",
            name: "28 Degrees",
          }),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        await transformPlaywrightMatchToPact(route, testInfo, { consumer, provider })
        return
      })

      await page.goto('/products/10')
      await page.waitForTimeout(1000)  
    })

    // No auth token - how to send request without it & get Playwright to mock the response?
    // Do I need to send the request directly with Playwright rather than interacting with the UI?
  })

  test.describe("product with ID 11 does not exist", () => {
    test("get product with ID 11", async({page}, testInfo) => {
      await page.route(apiBaseUrl + '/product/11', async (route) => {
        route.fulfill({
          status: 404
        })
        await transformPlaywrightMatchToPact(route, testInfo, { consumer, provider })
        return
      })

      await page.goto('/products/11')
      await page.waitForTimeout(1000)  
    })

  })
})
