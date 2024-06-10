<>
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-opacity-90 backdrop-blur-sm z-40"></div>
)}
<button
  className="btn btn-square ml-4"
  onClick={() => {
    const modal = document.getElementById(
      "api_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setIsModalOpen(true);
    }
  }}
>
  API
</button>
<dialog id="api_modal" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => setIsModalOpen(false)}
      >
        ✕
      </button>
    </form>
    <h3 className="font-bold text-lg">API Keys</h3>
    <p className="py-4">none</p>
    <section className="border-t border-t-green opacity-80">
      <div className="flex p-4 pb-0">
        <select className="select select-ghost max-w-xs">
          <option disabled selected>
            API
          </option>
          <option>OpenAI</option>
          <option>Groq</option>
          <option>Claude</option>
        </select>
        <input
          type="text"
          placeholder="Enter your key"
          className="input input-ghost flex-grow mr-4"
        />
        <button className="btn bg-transparent border-none hover:bg-green hover:text-white">
          +
        </button>
      </div>
    </section>
  </div>
</dialog>
<button
  className="btn btn-square ml-4"
  onClick={() => {
    const modal = document.getElementById(
      "string_interpolation_modal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      setIsModalOpen(true);
    }
  }}
>
  /
</button>
<dialog id="string_interpolation_modal" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        onClick={() => setIsModalOpen(false)}
      >
        ✕
      </button>
    </form>
    <h3 className="font-bold text-lg pb-2">
      String /
    </h3>
    {stringInterpolationList && stringInterpolationList.map((list, index) => (
      <div className="flex border border-slate-600 border-b-0" key={index}>
        <h3 className="font-bold text-lg">String {index+1}</h3>
      </div>
    ))}
    <hr className="border-t border-slate-600 mb-6" />
    <div className="flex flex-col">
      {stringInterpolation.map((item) => (
        <div className="flex gap-8 w-full p-2" key={item.key}>
          <span className="w-full">{item.value}</span>
          <span className="w-full">{item.field}</span>
        </div>
      ))}
    </div>

    <section className="border-t border-t-green opacity-80">
      <div className="flex p-4 pb-0">
        <input
          type="text"
          placeholder="Variable"
          className="input input-ghost w-full max-w-xs"
          value={variable}
          onChange={(e) => setVariable(e.target.value)}
        />
        <input
          type="text"
          placeholder="Field"
          className="input input-ghost w-full max-w-xs mr-4"
          value={field}
          onChange={(e) => setField(e.target.value)}
        />
        <button
          className="btn bg-transparent hover:bg-green border-none hover:text-white"
          onClick={handleAddStringInterpolation}
        >
          +
        </button>
      </div>
    </section>
  </div>
</dialog>
</>