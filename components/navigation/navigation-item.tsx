"use client";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface NavigationItemProps {
  name: string;
  imageUrl: string;
  id: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  name,
  imageUrl,
  id,
}) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <div>
      <ActionTooltip side="right" align="center" label={name}>
        <button
          onClick={() => {
            onClick();
          }}
          className="group relative flex items-center"
        >
          <div
            className={`
              absolute left-0 bg-black dark:bg-white rounded-r-full transition-all w-[4px]
              ${params?.serverId !== id && "group-hover:h-[20px]"}
              ${params?.serverId === id ? "h-[36px]" : "h-[8px]"}
            `}
          />
          <div
            className={`
              relative group flex h-[48px] w-[48px] ml-3 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden
              ${
                params?.serverId === id &&
                "bg-black/10 text-black dark:text-white dark:bg-white/10 rounded-[16px]"
              }
            `}
          >
            <Image fill alt="Channel" src={imageUrl} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationItem;
