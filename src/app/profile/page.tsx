import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";

export default function Profile() {
  return (
    <main>
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
        <Typography className="text-white ">Pages / Profile</Typography>
        <Typography className="text-white" weight="bold">
          Profile
        </Typography>
      </div>

      <div className="w-[90%] flex gap-4 relative rounded-lg z-10 mt-[-72px] backdrop-blur-2xl shadow-lg mx-auto p-6">
        <NextImage
          src="/profile/user.png"
          width={1440}
          height={1024}
          alt="Background"
          className="w-8 h-8 relative top-2 opacity-90 -z-10 flex"
          imgClassName=""
          priority
        />
        {/* <NextImage className=""></NextImage> */}
        <div>
          <Typography className="text-[#2D3748]" variant="p" weight="black">
            ProfJustin
          </Typography>
          <Typography className="text-[#718096] font-inter font-extrabold">
            profjustinjagobanget@gmail.com
          </Typography>
        </div>
      </div>
      <div className="w-[90%] rounded-lg z-10 mt-4 shadow-lg mx-auto p-12">
        <Typography className="text-[#2D3748] mb-2" variant="h6" weight="bold">
          Profile Information
        </Typography>
        <Typography className="text-[#A0AEC0]">
          Hi, I’m Prof Justin, Decisions: If you can’t decide, the answer is no.
          If two equally difficult paths, choose the one more painful in the
          short term (pain avoidance is creating an illusion of equality).
        </Typography>
        <div className="flex mt-10">
          <Typography className="text-[#718096]" weight="bold">
            Full Name :
          </Typography>
          <Typography className="text-[#A0AEC0]">&nbsp;Prof Justin</Typography>
        </div>
        <div className="flex mt-10">
          <Typography className="text-[#718096]" weight="bold">
            Mobile :
          </Typography>
          <Typography className="text-[#A0AEC0]">
            &nbsp;(44) 123 1234 123
          </Typography>
        </div>
        <div className="flex mt-10">
          <Typography className="text-[#718096]" weight="bold">
            Email :
          </Typography>
          <Typography className="text-[#A0AEC0]">
            &nbsp;profjustinjagobanget@gmail.com
          </Typography>
        </div>
        <div className="flex mt-10">
          <Typography className="text-[#718096]" weight="bold">
            Location :
          </Typography>
          <Typography className="text-[#A0AEC0]">
            &nbsp;Surabay Nih Bos
          </Typography>
        </div>
      </div>
    </main>
  );
}
