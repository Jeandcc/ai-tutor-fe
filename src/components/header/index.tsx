import React from "react";
import Image from "next/image";
import Link from "next/link";
import { DollarSign, ScrollText } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

import styles from "./styles.module.css";

export const Header: React.FC<{}> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <Link
          href="https://learner.com"
          target="_blank"
          className={styles.logo}
        >
          <Image
            src="https://cdn.prod.website-files.com/600f0ea5652fe47991474630/602428438327a78cb4e7fcb3_learnerlogo.svg"
            alt="Learner logo"
            className={styles.logo}
            width={223}
            height={45}
          />
        </Link>
      </div>

      <div className={styles.right}>
        <SignedIn>
          <UserButton showName>
            {/* The below is a direct link under the user picture */}
            <UserButton.MenuItems>
              <UserButton.Action
                label="Manage subscription"
                labelIcon={<DollarSign size={16} />}
                onClick={() => alert("init chat")}
              />
            </UserButton.MenuItems>

            {/* The below is a page of the modal */}
            <UserButton.UserProfilePage
              label="Terms"
              labelIcon={<ScrollText size={16} />}
              url="terms"
            >
              <div>
                <h1 className={styles["user-profile-page-title"]}>
                  Custom Terms Page
                </h1>
                <p>This is the content of the custom terms page.</p>
              </div>
            </UserButton.UserProfilePage>
          </UserButton>
        </SignedIn>
      </div>
    </div>
  );
};
