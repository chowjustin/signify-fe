"use client";

import useAuthStore from "@/app/stores/useAuthStore";
import BreadCrumbs from "@/components/BreadCrumbs";
import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import withAuth from "@/components/hoc/withAuth";

const breadCrumbs = [
  { href: "/dashboard", Title: "Dashboard" },
  { href: "/dashboard/profile", Title: "Profil" },
];

export default withAuth(Profile, "user");
function Profile() {
  const { user } = useAuthStore();

  const getAccountAge = (createdDate: string): string => {
    const createdAt = new Date(createdDate);
    const now = new Date();

    let years = now.getFullYear() - createdAt.getFullYear();
    let months = now.getMonth() - createdAt.getMonth();
    let days = now.getDate() - createdAt.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} years ${months} months ${days} days`;
  };

  const accountAge = user?.createdAt ? getAccountAge(user.createdAt) : "N/A";

  return (
    <section className="pb-12 max-h-screen">
      <NextImage
        src="/profile/Background.png"
        width={1440}
        height={1024}
        alt="Background"
        className="w-[full] px-6 mt-6 -z-10 flex"
        imgClassName="w-full h-48 mx-auto "
        priority
      />
      <div className="relative top-[-180px] pl-10">
        <BreadCrumbs breadcrumbs={breadCrumbs} />
      </div>

      <div className="w-[90%] flex gap-4 relative rounded-lg z-10 mt-[-72px] backdrop-blur-2xl shadow-lg  mx-auto p-6">
        <NextImage
          src="/profile/user.png"
          width={1440}
          height={1024}
          alt="Background"
          className="w-8 h-8 relative top-2 opacity-90 -z-10 flex"
          imgClassName=""
          priority
        />
        <div>
          <Typography className="text-[#2D3748]" variant="p" weight="black">
            {user?.name}
          </Typography>
          <Typography className="text-[#718096]" weight="regular">
            {user?.username}
          </Typography>
        </div>
      </div>
      <div className="w-[90%] rounded-lg z-10 mt-4 space-y-4  shadow-lg mx-auto p-12 max-sm:p-4">
        <div className="flex">
          <Typography className="text-[#718096]" weight="bold">
            Email :
          </Typography>
          <Typography className="text-[#A0AEC0] break-words truncate">
            &nbsp;{user?.email}
          </Typography>
        </div>
        <div className="flex">
          <Typography className="text-[#718096]" weight="bold">
            Account Age :
          </Typography>
          <Typography className="text-[#A0AEC0] break-words truncate">
            &nbsp;{accountAge}
          </Typography>
        </div>
        <div>
          <Typography className="text-[#718096]" weight="bold">
            Preview TTD
          </Typography>

          <img
            src={user?.ttd}
            alt="TTD Preview"
            className="w-fit object-contain mt-2 rounded-lg overflow-hidden border-2 border-[#718096] p-2"
          />
        </div>
      </div>
    </section>
  );
}
