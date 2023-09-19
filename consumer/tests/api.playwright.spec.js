import { test, expect } from '@playwright/test'
import { transformPlaywrightMatchToPact } from '../src/playwrightSerialiser'

const pacticipant = 'FrontendPW'
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
  test.describe("getting all products", () => {
    test("products exists", async ({page}) => {
      
      await page.route(apiBaseUrl + '/products', async (route) => {
        route.fulfill({
          status: 200,
          body: JSON.stringify(productData),
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        await transformPlaywrightMatchToPact(route, { pacticipant, provider })
        return
      })

      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      await page.waitForTimeout(1000)
    })
  
    test("no products exist", async({page}) => {
      await page.route(apiBaseUrl + '/products', async (route) => {
        route.fulfill({
          status: 200,
          body: '[]',
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
        await transformPlaywrightMatchToPact(route, { pacticipant, provider })
        return
      })

      await page.goto('/')
      await expect(page.locator('h1')).toBeVisible()
      await page.waitForTimeout(1000)  

    })

    // No auth token - how to send request without it & get Playwright to mock the response?
    // Do I need to send the request directly with Playwright rather than interacting with the UI?
  })

  test.describe("getting one product", () => {
    test("ID 10 exists", async({page}) => {
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
        await transformPlaywrightMatchToPact(route, { pacticipant, provider })
        return
      })

      await page.goto('/products/10')
      await page.waitForTimeout(1000)  
    })

    test("product does not exist", async({page}) => {
      await page.route(apiBaseUrl + '/product/11', async (route) => {
        route.fulfill({
          status: 404
        })
        await transformPlaywrightMatchToPact(route, { pacticipant, provider })
        return
      })

      await page.goto('/products/11')
      await page.waitForTimeout(1000)  
    })

    // No auth token - how to send request without it & get Playwright to mock the response?
    // Do I need to send the request directly with Playwright rather than interacting with the UI?
  })
})
