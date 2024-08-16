import { icons } from 'lucide-react';

interface IProps{
name:string;
className?:string;

}
const Icon:React.FC<IProps> = ({ name,   }) => {
   //@ts-ignore
  const LucideIcon = icons[name];
  return <LucideIcon />;
};

export default Icon;