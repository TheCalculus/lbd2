import type { MetaFunction } from "@remix-run/node";
import logo from "public/lbd.png";

export const meta: MetaFunction = () => {
    return [
        { title: "lbd_v2" },
        { name: "description", content: "are u and ur friends unhealthily competitive? good cause thats business for us" },
    ];
};

export default function Index() {
    return (
        <div>
            <img src={logo}></img>
        </div>
    );
}
