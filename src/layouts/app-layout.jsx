import Header from '@/components/header'
import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <>
      <div className="grid-background"></div>
      <div className="min-h-screen custom-container"> 
        <Header />
        <Outlet />
      </div>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗
      </div>
    </>
  )
}

export default AppLayout
