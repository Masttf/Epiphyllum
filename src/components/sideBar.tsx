import React from "react";
import Profile from "./profile";
import Categories from "./categories";
import Tag from "./tag";
interface Props {
    className?: string;
}

export default function SideBar(props: Props) {
    return (
        <div className={"flex flex-col gap-4 " + props.className}>
            <div className="flex flex-col">
                <Profile></Profile>
            </div>
            <Categories></Categories>
            <Tag></Tag>
        </div>
    );
}
