import {test,expect} from "@playwright/test"
import path from "path"
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

test("should allow to add a hotel",async ({page}) => {
    await page.goto(`${UI_Url}add-hotel`)
    await page.locator('[name="name"]').fill("teste hotel 4")
    await page.locator('[name="city"]').fill("teste cidade 4")
    await page.locator('[name="country"]').fill("Brasil")
    await page.locator('[name="description"]').fill("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec urna vitae arcu sodales vehicula. Integer in ligula non dolor convallis tincidunt. Vivamus vel justo vel leo fermentum faucibus. Phasellus ac nulla ut justo commodo dignissim. Sed sit amet risus odio. Integer nec enim ut metus malesuada tincidunt. Vivamus ultricies, risus nec cursus malesuada, metus justo tincidunt elit, sed tristique justo lorem nec lacus. Cras molestie hendrerit neque, vel efficitur risus varius eget. Sed et ante ac magna vulputate iaculis eu nec lacus. Ut vitae arcu vitae est volutpat aliquet eget nec lectus. Sed sit amet luctus purus. Sed consequat, lorem vel fermentum commodo, libero mi luctus dolor, nec tempus velit risus et neque. Nunc at urna vel nibh placerat pulvinar. Suspendisse potenti. Sed nec tortor vehicula, hendrerit velit ac, efficitur metus.")
    await page.locator('[name="pricePerNight"]').fill("200")
    await page.selectOption(`select[name="starRating"]`,"3")
    await page.getByText("Cabana").click()
    await page.getByLabel("Wi-Fi gratuito").check()
    await page.getByLabel("Academia").check()
    await page.locator(`[name="adultCount"]`).fill("2")
    await page.locator(`[name="childCount"]`).fill("1")

    await page.setInputFiles('[name="imageFiles"]',[
        path.join(__dirname,"files","1.jpg"),
        path.join(__dirname,"files","2.jpg"),
        path.join(__dirname,"files","3.jpg")
    ])
    
    await page.getByRole('button',{name:"Enviar"}).click()

    await expect(page.getByText("Hotel criado com sucesso")).toBeVisible()



})

test("should display hotels",async ({page}) => {
    await page.goto(`${UI_Url}my-hotels`);
    await expect(page.getByText("teste hotel")).toBeVisible()

    await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible()

    await expect(page.getByText("teste cidade, Brasil")).toBeVisible()
    await expect(page.getByText("Cabana")).toBeVisible()
    await expect(page.getByText("R$200 diária")).toBeVisible()
    await expect(page.getByText("2 Adultos ,1 Criança")).toBeVisible()
    await expect(page.getByText("3 Estrelas")).toBeVisible()

    await expect(page.getByRole("link",{name:"Mais detalhes"}).first()).toBeVisible()

    await expect(page.getByRole("link",{name:"Adicionar Hotel"})).toBeVisible()

})

test("should edit hotel",async ({page}) => {
    await page.goto(`${UI_Url}my-hotels`)

    await page.getByRole("link",{name:"Mais detalhes"}).first().click()

    await page.waitForSelector(`[name="name"]`,{state:"attached"})

    await expect(page.locator(`[name="name"]`)).toHaveValue("teste hotel")

    await page.locator(`[name="name"]`).fill("teste hotel atualizado")

    await page.getByRole("button",{name:"Enviar"}).click()

    await expect(page.getByText("Hotel atualizado")).toBeVisible()

    await page.reload()

    await expect(page.locator(`[name="name"]`)).toHaveValue("teste hotel atualizado")

    await page.locator(`[name="name"]`).fill("teste hotel")

    await page.getByRole("button",{name:"Enviar"}).click()


})