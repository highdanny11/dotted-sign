import Finish from '@/assets/Finish.svg';
import { useState } from 'react';
import { useSignStore } from '@/store/useSign';

type StepState = 'active' | 'finish' | 'default';

interface StepItem {
  liStyle: string;
  divStyle: string;
  spanStyle: string;
}
interface StepItemProps extends StepItem {
  state: StepState;
  text: string;
}

const stateStyle: Record<StepState, StepItem> = {
  active: {
    liStyle:
      'xl:after:bg-grey flex items-center gap-2 flex-grow md:flex-grow-0 xl:after:h-[2px] xl:after:rounded xl:after:w-[80px]',
    divStyle:
      'border-primary flex h-10 w-10 items-center rounded-full border-2 p-1',
    spanStyle:
      'bg-brand flex h-full w-full items-center justify-center rounded-full font-bold text-white',
  },
  finish: {
    liStyle:
      'xl:after:bg-grey flex items-center gap-2 xl:after:ml-2 xl:after:h-[2px] xl:after:rounded xl:after:w-[80px]',
    divStyle: 'flex h-10 w-10 items-center rounded-full p-1',
    spanStyle:
      'bg-brand flex h-full w-full items-center justify-center rounded-full text-white',
  },
  default: {
    liStyle:
      'xl:after:bg-grey flex items-center gap-2 xl:after:ml-2 xl:after:h-[2px] xl:after:rounded xl:after:w-[80px]',
    divStyle:
      'border-grey flex h-10 w-10 items-center justify-center rounded-full border-2 p-2',
    spanStyle:
      'text-dark-grey flex h-full w-full items-center justify-center rounded-full font-bold',
  },
};

const lastStateStyle: Record<StepState, StepItem> = {
  active: {
    liStyle: 'flex-grow flex items-center gap-2 md:flex-grow-0',
    divStyle:
      'border-primary flex h-10 w-10 items-center rounded-full border-2 p-1',
    spanStyle:
      'bg-brand flex h-full w-full items-center justify-center rounded-full font-bold text-white',
  },
  finish: {
    liStyle: 'flex items-center gap-2',
    divStyle: 'flex h-10 w-10 items-center rounded-full p-1',
    spanStyle:
      'bg-brand flex h-full w-full items-center justify-center rounded-full text-white',
  },
  default: {
    liStyle: 'flex items-center gap-2',
    divStyle:
      'border-grey flex h-10 w-10 items-center justify-center rounded-full border-2 p-2',
    spanStyle:
      'text-dark-grey flex h-full w-full items-center justify-center rounded-full font-bold',
  },
};

export function Step() {
  const [steps, setSteps] = useState<StepItemProps[]>([
    {
      state: 'finish',
      text: '成功上傳檔案',
      ...stateStyle['finish'],
    },
    {
      state: 'active',
      text: '加入簽名檔',
      ...stateStyle['active'],
    },
    {
      state: 'default',
      text: '確認檔案',
      ...stateStyle['default'],
    },
    {
      state: 'default',
      text: '下載檔案',
      ...lastStateStyle['default'],
    },
  ]);
  const activeStep = useSignStore((state) => state.activeStep);

  useEffect(() => {
    const init = () => {
      const newSteps = steps.map((item, index) => {
        const data = { ...item };
        if (index < activeStep) {
          data.state = 'finish';
          data.liStyle = stateStyle['finish'].liStyle;
          data.divStyle = stateStyle['finish'].divStyle;
          data.spanStyle = stateStyle['finish'].spanStyle;
        } else if (index === activeStep) {
          data.state = 'active';
          data.liStyle = stateStyle['active'].liStyle;
          data.divStyle = stateStyle['active'].divStyle;
          data.spanStyle = stateStyle['active'].spanStyle;
        } else {
          data.state = 'default';
          data.liStyle = stateStyle['default'].liStyle;
          data.divStyle = stateStyle['default'].divStyle;
          data.spanStyle = stateStyle['default'].spanStyle;
        }
        return data;
      });
      setSteps(newSteps);
    };
    init();
  }, [activeStep]);

  return (
    <ul className="container flex items-center gap-2 py-2 md:justify-center md:gap-4">
      {steps.map((item, index) => (
        <li className={item.liStyle} key={index}>
          <div className={item.divStyle}>
            <span className={item.spanStyle}>
              {item.state === 'finish' ? (
                <img src={Finish} alt="FinishIcon" />
              ) : (
                index + 1
              )}
            </span>
          </div>
          <span
            className={item.state === 'active' ? 'inline' : 'hidden md:inline'}>
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
