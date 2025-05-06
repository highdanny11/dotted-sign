import Google from '@/assets/Google.svg';
import Facebook from '@/assets/Facebook.svg';
import Logo from '@/assets/Logo.svg';
import RegisterImg from '@/assets/RegisterImg.svg';
import { Link } from 'react-router';
import { Input } from '@/component/form/Input';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { signup } from '@/api/users';

const schema = z.object({
  name: z.string().min(1, { message: "姓名必填" }),
  email: z.string().email({ message: "請輸入正確的電子郵件" }),
  password: z.string().min(6, { message: "密碼至少6個字元" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message: "密碼至少包含一個大寫字母、一個小寫字母和一個數字",
  }),
})

type RegisterForm = z.infer<typeof schema>

export function Register() {
  const facebookLogin = () => {
    window.open('http://localhost:8080/api/users/facebook', '_self');
  };
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  })
  const onSubmit = async(data: RegisterForm) => {
    console.log(data)
    try {
      const res = await signup({...data,confirm: data.password})
      console.log(res)
    }catch (error) {
      console.error(error)

    }
  }
  return (
    <div className="items-center justify-between gap-4 md:flex">
      <div className="flex-grow md:pt-10 lg:max-w-[416px]">
        <img className="mx-auto mb-8" src={Logo} alt="logo" />
        <ul className="mb-6 flex items-center gap-4">
          <li className="w-1/2">
            <button
              type="button"
              className="text-sx flex min-h-[48px] w-full items-center justify-center gap-2 rounded border border-[#1877F2]">
              <img src={Google} alt="GoogleIcon" />
              透過 Google 註冊
            </button>
          </li>
          <li className="w-1/2">
            <button
              type="button"
              onClick={facebookLogin}
              className="text-sx flex min-h-[48px] w-full items-center justify-center gap-2 rounded border border-[#1877F2]">
              <img src={Facebook} alt="FacebookIcon" />
              透過 facebook 註冊
            </button>
          </li>
        </ul>
        <form className="border-grey border-t pt-6 text-center" onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("name")}
            className={`border-grey w-full rounded border p-3 text-sm leading-0 ${errors.name ? 'border-[#D83A52]' : 'mb-3'}`}
            type="text"
            placeholder="請輸入姓名"
          />
          {errors.name && <p className="text-[#D83A52] text-left  mb-3">{errors.name.message}</p>}
          <Input
            {...register("email")}
            className={`border-grey w-full rounded border p-3 text-sm leading-0 ${errors.email ? 'border-[#D83A52]' : 'mb-3'}`}
            type="text"
            placeholder="請輸入電子郵件"
          />
          {errors.email && <p className="text-[#D83A52] text-left  mb-3">{errors.email.message}</p>}
          <Input
            {...register("password")}
            className={`border-grey w-full rounded border p-3 text-sm leading-0 ${errors.password ? 'border-[#D83A52]' : 'mb-3'}`}
            type="password"
            autoComplete='off'
            placeholder="請輸入密碼"
          />
          {errors.password && <p className="text-[#D83A52] text-left  mb-3">{errors.password.message}</p>}
          <button
            className="bg-brand mb-4 flex min-h-[38px] w-full items-center justify-center rounded text-white"
            type="submit">
            註冊
          </button>
          <p className="text-center text-sm">
            已經有帳戶?
            <Link className="text-brand pl-2 text-sm underline" to="/login">
              登入
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden flex-grow md:block lg:max-w-[416px]">
        <h3 className="text-center text-xl font-bold">
          為高效率的您，提供快速的服務。
        </h3>
        <img src={RegisterImg} alt="RegisterImg" />
      </div>
    </div>
  );
}
