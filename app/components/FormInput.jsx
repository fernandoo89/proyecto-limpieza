export default function FormInput({ name, type = "text", placeholder, value, onChange, required }) {
    return (
        <input
            name={name}
            type={type}
            placeholder={placeholder}
            className="input-base"
            value={value}
            onChange={onChange}
            required={required}
        />
    );
}
