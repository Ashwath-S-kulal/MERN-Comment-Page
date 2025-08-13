
import { NavLink } from "react-router-dom";

export default function Projects() {
  return (
    <main className="container flex items-center flex-col pt-4">
      <h1 className="font-extrabold text-2xl">My Gallery</h1>
      <div className="flex flex-wrap justify-center gap-5">
        <NavLink to='/project'>
        <img src="https://thumbs.dreamstime.com/b/organic-rice-farming-reduces-chemical-inputs-promotes-sustainable-agriculture-healthier-ecosystems-practices-380817912.jpg" alt="Image" className="w-60 h-80 ring-2 rounded-lg mt-5 text-center object-cover"/>
      </NavLink>
      <NavLink to='/'>
        <img src="https://pbs.twimg.com/media/FIpyHyxVgAEco70.jpg" alt="Image" className="w-60 h-80 ring-2 rounded-lg mt-5 text-center"/>
      </NavLink>
      <NavLink to='/'>
        <img src="https://www.karnataka.com/wp-content/uploads/2007/09/768px-Udupi.jpg" alt="Image" className="w-60 h-80 ring-2 rounded-lg mt-5 text-center"/>
      </NavLink>
      <NavLink to='/'>
        <img src="https://www.prente.co.za/wp-content/smush-webp/2023/06/Wildlife-Prente-by-Jandre-Germishuizen-5.jpeg.webp" alt="Image" className="w-60 h-80 ring-2 rounded-lg mt-5 text-center"/>
      </NavLink>
      </div>
      
    </main>
  );
}
