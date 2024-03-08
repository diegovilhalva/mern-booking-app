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

test("Should show hotel detail",async ({page}) => {
    await page.goto(UI_Url)
    await page.getByPlaceholder("Para onde você está indo?").fill("Londres")
    await page.getByRole("button",{name:"Pesquisar"}).click()

    await page.getByText("Teste hotel 5").click()

    await expect(page).toHaveURL(/detail/)

    await expect(page.getByRole("button",{name:"Reservar"})).toBeVisible()
})


test("Should book hotel",async ({page}) => {
    await page.goto(UI_Url)
    await page.getByPlaceholder("Para onde você está indo?").fill("Londres")
    const date = new Date()
    date.setDate(date.getDate() + 3)

    const formattedDate = date.toISOString().split("T")[0]

    await page.getByPlaceholder("data de saída").fill(formattedDate)

    await page.getByRole("button",{name:"Pesquisar"}).click()

    await page.getByText("Teste hotel 5").click()

    

    await page.getByRole("button",{name:"Reservar"}).click()

    await expect(page.getByText("Valor total R$ 1.200,00")).toBeVisible()

    const stripeFrame = page.frameLocator("iframe").first()

    await stripeFrame.locator('[placeholder="Número do cartão"]').fill("4242424242424242")
    await stripeFrame.locator('[placeholder="MM / AA"]').fill("0525")
    await stripeFrame.locator('[placeholder="CVC"]').fill("100")
    await stripeFrame.locator('[placeholder="CEP"]').fill("24345")

    await page.getByRole("button",{name:"Confirmar reserva"}).click()

    await expect(page.getByText("Reserva feita com sucesso!")).toBeVisible()

    await page.getByRole("link",{name:"Minhas Reservas"}).click()

    await expect(page.getByText("Teste hotel 5")).toBeVisible()


})

