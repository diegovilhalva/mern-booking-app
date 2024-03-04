import {test,expect} from "@playwright/test"

const UI_Url = 'http://localhost:5173/'


test.beforeEach(async ({page}) => {
    await page.goto(UI_Url)

    // get the sign in button
    await page.getByRole("link",{name:"Login"}).click()
  
    await expect(page.getByRole("heading",{name:"Fazer Login"})).toBeVisible()
  
    await page.locator("[name=email]").fill("diego@teste.com")
    await page.locator("[name=password]").fill("12345678")
  
    await page.getByRole("button",{name:"Entrar"}).click()
  
    await expect(page.getByText("Bem vindo!")).toBeVisible()
    
})

test("Should show hotel search results",async ({page}) => {
    await page.goto(UI_Url);
    await page.getByPlaceholder("Para onde você está indo?").fill("Londres")
    await page.getByRole("button",{name:"Pesquisar"}).click()
    
    await expect(page.getByText("Hoteis encontrados em Londres")).toBeVisible()
    await expect(page.getByText("Teste hotel 5")).toBeVisible()
})