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
            <div className="w-full">
                <div className="flex flex-col w-full">
                    <Profile></Profile>
                </div>
            </div>
            <div className="flex flex-col w-full gap-4">
                <Categories></Categories>
                <Tag></Tag>
            </div>
        </div>
    );
}
