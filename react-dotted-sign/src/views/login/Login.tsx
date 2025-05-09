import Google from '@/assets/Google.svg';
import Facebook from '@/assets/Facebook.svg';
import Logo from '@/assets/Logo.svg';
import LoginImg from '@/assets/LoginImg.svg';
import { Link } from 'react-router';
import { Input } from '@/component/form/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/api/users';
import * as z from 'zod';
import { useNavigate } from 'react-router';

const schema = z.object({
  email: z.string().email({ message: '請輸入正確的電子郵件' }),
  password: z
    .string()
    .min(6, { message: '密碼至少6個字元' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
      message: '密碼至少包含一個大寫字母、一個小寫字母和一個數字',
    }),
});

type LoginForm = z.infer<typeof schema>;

export function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const facebookLogin = () => {
    window.open('https://sign.sideproject.website/api/users/facebook', '_self');
  };
  const googleLogin = () => {
    window.open('https://sign.sideproject.website/api/users/google', '_self');
  };
  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const res = await login(data);
      sessionStorage.setItem('token', res.data.user.token);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="items-center justify-between gap-4 md:flex">
      <div className="flex-grow md:pt-10 lg:max-w-[416px]">
        <img className="mx-auto mb-8" src={Logo} alt="logo" />
        <ul className="mb-6 flex items-center gap-4">
          <li className="w-1/2">
            <button
              type="button"
              disabled={loading}
              onClick={googleLogin}
              className="text-sx flex min-h-[48px] w-full items-center justify-center gap-2 rounded border border-[#1877F2]">
              <img src={Google} alt="GoogleIcon" />
              透過 Google 登入
            </button>
          </li>
          <li className="w-1/2">
            <button
              type="button"
              disabled={loading}
              onClick={facebookLogin}
              className="text-sx flex min-h-[48px] w-full items-center justify-center gap-2 rounded border border-[#1877F2]">
              <img src={Facebook} alt="FacebookIcon" />
              透過 facebook 登入
            </button>
          </li>
        </ul>
        <form
          className="border-grey border-t pt-6 text-center"
          onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('email')}
            className={`border-grey w-full rounded border p-3 text-sm leading-0 ${errors.email ? 'border-[#D83A52]' : 'mb-3'}`}
            type="text"
            placeholder="請輸入電子郵件"
          />
          {errors.email && (
            <p className="mb-3 text-left text-[#D83A52]">
              {errors.email.message}
            </p>
          )}
          <Input
            {...register('password')}
            className={`border-grey w-full rounded border p-3 text-sm leading-0 ${errors.password ? 'border-[#D83A52]' : 'mb-3'}`}
            type="password"
            placeholder="請輸入密碼"
          />
          {errors.password && (
            <p className="mb-3 text-left text-[#D83A52]">
              {errors.password.message}
            </p>
          )}
          <Link className="text-brand mb-6 inline-block text-sm" to="/">
            忘記密碼
          </Link>
          <button
            disabled={loading}
            className="bg-brand mb-4 flex min-h-[38px] w-full items-center justify-center rounded text-white"
            type="submit">
            登入
          </button>
          <p className="text-center text-sm">
            還沒有帳戶?
            <Link className="text-brand pl-2 text-sm underline" to="/register">
              註冊
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden flex-grow md:block lg:max-w-[416px]">
        <h3 className="text-center text-xl font-bold">登入至您的檔案總管</h3>
        <img src={LoginImg} alt="LoginImg" />
      </div>
    </div>
  );
}
