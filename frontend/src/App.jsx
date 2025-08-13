import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Project from './pages/Project';
import Home from "./pages/Home";
import ReplyForm from './pages/ReplayForm';

export default function App() {
  return (
    <div className='bg-gray-900 min-h-screen min-w-fit text-white'>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/project" element={<Project />} />
        <Route path="/reply" element={<ReplyForm />} />
      </Routes>
   </BrowserRouter>
   </div>
  )
}
