import type { MetaFunction } from "@remix-run/node";
import logo from "public/lbd.png";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export default function Index() {
    return (
        <div>
            <img src={logo}></img>
        </div>
    );
}
