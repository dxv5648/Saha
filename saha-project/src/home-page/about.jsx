export default function about() {
  return (
    <div>
      <div className="flex flex-col items-center self-stretch w-full px-[10vw]">
        <div
          className="flex flex-col items-start bg-[#121212B0] rounded-[20px] w-full max-w-[926px]"
          style={{ padding: "clamp(25px, 3vw, 37px)" }}
        >
          <span
            className="text-white font-bold mb-[35px] text-center w-full"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 1.875rem)",
              marginTop: "clamp(30px, 4vw, 52px)",
            }}
          >
            {"About saha."}
          </span>
          <span
            className="text-[#F3F3F3] w-full mb-[35px]"
            style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}
          >
            {
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sodales nibh enim, ac placerat arcu commodo vitae. Pellentesque et tortor non dui interdum aliquet eu ac nulla. Praesent et semper ante. Donec nisl quam, egestas ut porta nec, egestas nec sem. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent iaculis nulla neque, a iaculis elit viverra vel. Duis eget ex ac mi malesuada finibus sit amet quis metus. Duis vitae ex at velit consequat molestie. Vestibulum risus massa, iaculis sit amet purus sed, malesuada placerat sapien. Fusce risus leo, ultricies id tincidunt et, commodo et arcu. Vestibulum consectetur pulvinar consequat. Sed varius enim ligula, ac ultricies tortor pretium a. In hac habitasse platea dictumst. Nulla nec cursus tellus. In tincidunt quis magna tincidunt imperdiet."
            }
          </span>
        </div>
      </div>
    </div>
  );
}
