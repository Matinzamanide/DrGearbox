import type { IChildren } from "../type/type";
import Navbar from "./Navbar";

const Layout:React.FC<IChildren>=({children})=>{

    return(
        <div className="mx-auto">
            <Navbar/>
            {children}
        </div>
    )
}
export default Layout;