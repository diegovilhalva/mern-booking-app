import { test, expect } from '@playwright/test';
const UI_Url = 'http://localhost:5173/'

test('should allow the user to sign in', async ({ page }) => {
  await page.goto(UI_Url)

  // get the sign in button
  await page.getByRole("link",{name:"Login"}).click()

  await expect(page.getByRole("heading",{name:"Fazer Login"})).toBeVisible()

  await page.locator("[name=email]").fill("diego@teste.com")
  await page.locator("[name=password]").fill("12345678")

  await page.getByRole("button",{name:"Entrar"}).click()

  await expect(page.getByText("Bem Vindo")).toBeVisible()

  await expect(page.getByRole("link",{name:"Minhas viagens"})).toBeVisible()
  await expect(page.getByRole("link",{name:"Meus Hoteis"})).toBeVisible()
  await expect(page.getByRole("button",{name:"Sair"})).toBeVisible()
});

test("should allow user to register",async ({page}) => {
  const testeEmail = `test_${Math.floor(Math.random() * 90000) + 10000}@teste.com`
  await page.goto(UI_Url)
  await page.getByRole("link",{name:"Login"}).click()
  await page.getByRole("link",{name:"Crie uma conta"}).click()
  await expect(page.getByRole("heading",{name:"Crie sua conta"})).toBeVisible()

  await page.locator("[name=firstName]").fill("teste_first_name")
  await page.locator("[name=lastName]").fill("teste_last_name")
  await page.locator("[name=email]").fill(testeEmail)
  await page.locator("[name=password]").fill("12345678")
  await page.locator("[name=confirmPassword]").fill("12345678")

  await page.getByRole("button",{name:"Criar conta"}).click()

  await expect(page.getByText("Usuário registrado com sucesso")).toBeVisible()

  await expect(page.getByRole("link",{name:"Minhas viagens"})).toBeVisible()
  await expect(page.getByRole("link",{name:"Minhas Reservas"})).toBeVisible()
  await expect(page.getByRole("button",{name:"Sair"})).toBeVisible()

})

