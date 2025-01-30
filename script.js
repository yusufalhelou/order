import React, { useState, useEffect, useContext, useMemo, createContext } from "https://esm.sh/v135/react@18.3.1";
import { createRoot } from "https://esm.sh/v135/react-dom@18.3.1";
import { BrowserRouter, Routes, Route, useNavigate } from "https://esm.sh/v135/react-router-dom@6.24.1";

/* Global Variables */
const sizeOptions = {
    small: {
        basePrice: 26500
    },
    medium: {
        basePrice: 47500
    },
    large: {
        basePrice: 50000
    }
};

const toppingOptions = {
    pepperoni: {
        icons: [],
        amount: 12
    },
    sausage: {
        icons: [],
        amount: 13
    },
    chicken: {
        icons: [],
        amount: 14
    },
    onions: {
        icons: ["vegetarian"],
        amount: 15
    },
    peppers: {
        icons: ["vegetarian"],
        amount: 15
    },
    mushrooms: {
        icons: ["vegetarian"],
        amount: 22
    },
    pineapple: {
        icons: ["vegetarian"],
        amount: 16
    },
    olives: {
        icons: ["vegetarian"],
        amount: 19
    },
    jalapenos: {
        icons: ["vegetarian", "hot"],
        amount: 19
    }
};

const discountCodes = {
    yusuf: 100,
    mario: 100,
    israa: 99.99,
    yomna: 99.99,
    hana: 99.99,
    nada: 99.99,
    mayar: 0.01,
    fiftyone: 51,
    51: 51,
    graduation: 51,
    gradteam: 51,

};

const toppingPrice = 0;

const PizzaContext = createContext({});

export const PizzaProvider = ({ children }) => {
    const [selectedSize, setSelectedSize] = useState("large");
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(false);

    return (
        React.createElement(PizzaContext.Provider, {
            value: {
                selectedSize,
                setSelectedSize,
                selectedToppings,
                setSelectedToppings,
                discountCode,
                setDiscountCode,
                discountApplied,
                setDiscountApplied,
                orderConfirmed,
                setOrderConfirmed
            }
        }, children)
    );
};

const Layout = ({ page, children }) => {
    return React.createElement("div", { className: `container ${page}` }, children);
};

/* Header */
const Header = () => {
    return (
        React.createElement("header", null,
            React.createElement("h1", null,
                React.createElement("span", { "aria-hidden": true }, "\uD83C\uDF55"),
                "بيتزا 51",
                React.createElement("span", { "aria-hidden": true }, "\uD83C\uDF55")
            )
        )
    );
};

function ToppingIcon({ iconType }) {
    let iconText = "";
    if (iconType === "vegetarian") {
        iconText = "ن"; // نباتي
    } else if (iconType === "hot") {
        iconText = "ح"; // حار
    } else {
        iconText = iconType.charAt(0).toUpperCase();
    }

    return (
        React.createElement("span", {
            className: `pizza-options__topping-icon pizza-options__topping-icon--${iconType.split(" ")[0]}`,
            "aria-hidden": "true"
        }, iconText)
    );
}

const ToppingOption = ({ topping, toppingIcons }) => {
    const { selectedToppings, setSelectedToppings } = useContext(PizzaContext);

    const handleToppingOptionClick = (selectedTopping) => {
        if (selectedToppings.includes(selectedTopping)) {
            // Remove topping
            setSelectedToppings((prevSelectedToppings) => prevSelectedToppings.filter((topping) => topping !== selectedTopping));
        } else {
            // Add topping
            setSelectedToppings((prevSelectedToppings) => [
                ...prevSelectedToppings,
                selectedTopping
            ]);
        }
    };

    const toppingLabels = {
        pepperoni: "بيبروني",
        sausage: "سجق",
        chicken: "فراخ",
        onions: "بصل",
        peppers: "فلفل",
        mushrooms: "مشروم",
        pineapple: "أناناس",
        olives: "زيتون",
        jalapenos: "هالبينو"
    };

    return (
        React.createElement("li", { className: "pizza-options__topping" },
            React.createElement("input", {
                type: "checkbox",
                id: topping,
                className: "pizza-options__topping-input",
                checked: selectedToppings.includes(topping),
                onChange: (e) => handleToppingOptionClick(e.target.id)
            }),
            React.createElement("label", {
                className: "pizza-options__topping-label",
                htmlFor: topping,
                "aria-label": `${topping} (${toppingIcons.map((icon) => icon)})`
            },
                React.createElement("div", { className: "pizza-options__topping-image" },
                    React.createElement("div", { className: `${topping} topping-image-item` })
                ),
                React.createElement("span", { className: "pizza-options__topping-label-content" },
                    React.createElement("span", { className: "pizza-options__topping-label-text" }, toppingLabels[topping] || topping),
                    React.createElement("span", { className: "pizza-options__topping-label-icons" }, toppingIcons.map((icon) => (
                        React.createElement(ToppingIcon, { key: `${topping} ${icon}`, iconType: icon })
                    )))
                )
            )
        )
    );
};

/* Order Selection */
const PizzaOptions = () => {
    const { selectedSize, setSelectedSize } = useContext(PizzaContext);

    return (
        React.createElement("section", { className: "pizza-options panel", "aria-label": "خيارات البيتزا" },
            React.createElement("h2", null, "الخيارات"),
            React.createElement("h3", null, "الحجم"),
            React.createElement("div", { className: "pizza-options__size" },
                React.createElement("select", {
                    className: "pizza-options__size-input",
                    "aria-label": "حجم البيتزا",
                    value: selectedSize,
                    onChange: (e) => setSelectedSize(e.target.value)
                }, Object.keys(sizeOptions).map((size) => {
                    let sizeLabel = size;
                    if (size === "small") sizeLabel = "صغير";
                    if (size === "medium") sizeLabel = "وسط";
                    if (size === "large") sizeLabel = "كبير";
                    return React.createElement("option", { key: size, value: size }, sizeLabel);
                })),
                React.createElement("svg", {
                    className: "pizza-options__size-icon",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    "aria-hidden": "true"
                },
                    React.createElement("path", {
                        stroke: "#0e447a",
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: "2",
                        d: "M4 7l6 6 6-6"
                    })
                )
            ),
            React.createElement("h3", null, "الإضافات"),
            React.createElement("ul", { className: "pizza-options__details" },
                React.createElement("li", null,
                    React.createElement(ToppingIcon, { iconType: "vegetarian" }),
                    "نباتي"
                ),
                React.createElement("li", null,
                    React.createElement(ToppingIcon, { iconType: "hot" }),
                    "حار"
                )
            ),
            React.createElement("p", { className: "pizza-options__details" },
                "الإضافات بسعر ",
                (toppingPrice / 100).toFixed(2),
                " جنيه لكل واحدة."
            ),
            React.createElement("ul", { className: "pizza-options__toppings" }, Object.entries(toppingOptions).map(([topping, details]) => (
                React.createElement(ToppingOption, { key: topping, topping: topping, toppingIcons: details.icons })
            )))
        )
    );
};

/* Pizza Topping */
const PizzaTopping = ({ topping, toppingAmount }) => {
    let toppings = [];
    for (let i = 1; i <= toppingAmount; i++) {
        toppings.push(React.createElement("div", { key: `${topping + i}`, className: `topping ${topping} ${topping}-${i}` }));
    }
    return React.createElement(React.Fragment, null, [...toppings]);
};

/* Pizza */
const Pizza = () => {
    const { selectedSize, selectedToppings } = useContext(PizzaContext);

    return (
        React.createElement("div", { className: "pizza panel" },
            React.createElement("div", { className: `pizza__pie pizza__pie--${selectedSize}` }, selectedToppings.map((topping) => (
                React.createElement(PizzaTopping, { key: topping, topping: topping, toppingAmount: toppingOptions[topping].amount })
            )))
        )
    );
};

/* Order Details */
const OrderDetails = () => {
    const { selectedSize, selectedToppings, discountCode, setDiscountCode, discountApplied, setDiscountApplied, orderConfirmed, setOrderConfirmed } = useContext(PizzaContext);
    const navigate = useNavigate();

    const discountValid = useMemo(() => Object.keys(discountCodes).includes(discountCode), [discountCode]);

    const totalPrice = useMemo(() => parseFloat(((sizeOptions[selectedSize].basePrice +
        toppingPrice * selectedToppings.length) /
        100).toFixed(2)), [selectedSize, selectedToppings]);

    const handleDiscountInput = (value) => {
        setDiscountCode(value.trim().toLowerCase());
        if (discountApplied) {
            setDiscountApplied(false);
        }
    };

    const handleDiscountEnter = (e) => {
        if (e.key === "Enter") {
            setDiscountApplied(true);
        }
    };

    const handleOrderConfirm = () => {
        setOrderConfirmed(true);
        navigate("/confirmation");
    };

    const sizeLabels = {
        small: "صغير",
        medium: "وسط",
        large: "كبير"
    };

    const toppingLabels = {
        pepperoni: "بيبروني",
        sausage: "سجق",
        chicken: "فراخ",
        onions: "بصل",
        peppers: "فلفل",
        mushrooms: "مشروم",
        pineapple: "أناناس",
        olives: "زيتون",
        jalapenos: "هالبينو"
    };

    return (
        React.createElement("section", { className: "order-details panel", "aria-label": "تفاصيل الطلب" },
            React.createElement("h2", null, "تفاصيل الطلب"),
            React.createElement("div", { className: "order-details__size" },
                React.createElement("h3", null, "الحجم"),
                React.createElement("p", { className: "order-details__size-value" }, sizeLabels[selectedSize] || selectedSize)
            ),
            React.createElement("div", { className: "order-details__toppings" },
                React.createElement("h3", null, "الإضافات"),
                React.createElement("ul", { className: "order-details__toppings-list" },
                    React.createElement("li", { className: "order-details__toppings-item" }, "جبنة"),
                    selectedToppings.map((topping) => (
                        React.createElement("li", { key: topping, className: "order-details__toppings-item" }, toppingLabels[topping] || topping)
                    ))
                )
            ),
            React.createElement("div", { className: "order-details__discount" }, orderConfirmed ? (discountValid && (
                React.createElement(React.Fragment, null,
                    React.createElement("h3", null, "كود الخصم"),
                    React.createElement("p", { className: "order-details__discount-details" },
                        React.createElement("span", null, discountCode.toUpperCase()),
                        " -",
                        " ",
                        discountCodes[discountCode],
                        "% خصم"
                    )
                )
            )) : (
                React.createElement("div", { "aria-live": "polite" },
                    React.createElement("h3", null, "كود الخصم"),
                    React.createElement("input", {
                        type: "text",
                        className: "order-details__discount-input",
                        spellCheck: "false",
                        value: discountCode,
                        maxLength: 10,
                        "aria-label": "كود الخصم",
                        "aria-describedby": "discount-message",
                        "aria-invalid": discountApplied && !discountValid,
                        onChange: (e) => handleDiscountInput(e.target.value),
                        onKeyUp: (e) => handleDiscountEnter(e)
                    }),
                    discountApplied ? (discountValid ? (
                        React.createElement("p", {
                            id: "discount-message",
                            className: "order-details__discount-message order-details__discount-message--valid"
                        },
                            "الكود صالح: ",
                            discountCodes[discountCode],
                            "% خصم"
                        )
                    ) : (
                        React.createElement("p", {
                            id: "discount-message",
                            className: "order-details__discount-message order-details__discount-message--invalid"
                        },
                            "الكود غير صالح"
                        )
                    )) : null,
                    !discountApplied && (
                        React.createElement("button", {
                            className: "btn order-details__discount-apply",
                            onClick: () => setDiscountApplied(true),
                            "aria-label": "تطبيق الخصم"
                        },
                            "تطبيق"
                        )
                    )
                )
            )),
          React.createElement("div", { className: "order-details__price" },
                React.createElement("h3", null, "السعر الإجمالي"),
                React.createElement("p", { className: "order-details__price-value" }, discountApplied && discountValid ? (
                    React.createElement(React.Fragment, null,
                        React.createElement("ins", null,
                            "£", // Changed from $ to £
                            (totalPrice -
                                totalPrice * (discountCodes[discountCode] / 100)).toFixed(2)
                        ),
                        React.createElement("del", null,
                            "£", // Changed from $ to £
                            totalPrice.toFixed(2)
                        )
                    )
                ) : (`£${totalPrice.toFixed(2)}`)), // Changed from $ to £
                !orderConfirmed && (
                    React.createElement("button", {
                        className: "btn order-details__order",
                        "aria-label": "تأكيد الطلب",
                        onClick: handleOrderConfirm
                    },
                        "تأكيد الطلب"
                    )
                )
            )
        )
    );
};

/* Order Confirmation */
const OrderConfirmation = () => {
    return (
        React.createElement("section", { className: "order-confirmation panel" },
            React.createElement("svg", {
                className: "order-confirmation__icon",
                viewBox: "-1 0 19 19"
            },
                React.createElement("path", {
                    d: "M16.417 9.579A7.917 7.917 0 1 1 8.5 1.662a7.917 7.917 0 0 1 7.917 7.917zm-4.165-4.6a10.965 10.965 0 0 0-7.662-.004.396.396 0 1 0 .275.742 10.173 10.173 0 0 1 7.11.003.396.396 0 1 0 .277-.741zm-.435 1.48s-.23-.09-.498-.175a9.597 9.597 0 0 0-5.697-.034c-.3.09-.596.205-.596.205a.308.308 0 0 0-.175.407l3.444 8.327c.067.16.175.16.242 0l3.453-8.323a.31.31 0 0 0-.173-.408zM6.875 8.662a1.026 1.026 0 1 0-1.026-1.026 1.026 1.026 0 0 0 1.026 1.026zm1.546 3.852a1.026 1.026 0 1 0-1.026-1.025 1.026 1.026 0 0 0 1.026 1.025zm1.16-2.747a1.026 1.026 0 1 0-1.026-1.026A1.026 1.026 0 0 0 9.58 9.768z"
                })
            ),
            React.createElement("h2", null, "تم تأكيد الطلب"),
            React.createElement("p", null, "سيتم تجهيز طلبك قريبًا!")
        )
    );
};

/* Builder */
const Builder = () => {
    const { orderConfirmed, setOrderConfirmed } = useContext(PizzaContext);

    useEffect(() => {
        if (orderConfirmed) {
            setOrderConfirmed(false);
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    return (
        React.createElement(Layout, { page: "build" },
            React.createElement(PizzaOptions, null),
            React.createElement(Pizza, null),
            React.createElement(OrderDetails, null)
        )
    );
};

/* Confirmation */
const Confirmation = () => {
    const { orderConfirmed } = useContext(PizzaContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!orderConfirmed) {
            navigate("/");
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, []);

    return (
        React.createElement(Layout, { page: "confirmation" },
            React.createElement(OrderConfirmation, null),
            React.createElement(OrderDetails, null),
            React.createElement(Pizza, null)
        )
    );
};


/* Pizza Builder */
const PizzaBuilder = () => {
    return (
        React.createElement(React.Fragment, null,
            React.createElement(Header, null),
            React.createElement("main", null,
                React.createElement(PizzaProvider, null,
                    React.createElement(BrowserRouter, null,
                        React.createElement(Routes, null,
                            React.createElement(Route, { path: "/", element: React.createElement(Builder, null) }),
                            React.createElement(Route, { path: "*", element: React.createElement(Builder, null) }),
                            React.createElement(Route, { path: "/confirmation", element: React.createElement(Confirmation, null) })
                        )
                    )
                )
            )
        )
    );
};

/* Render */
const container = document.querySelector('#pizza-builder');
const root = container && createRoot(container);
root?.render(React.createElement(PizzaBuilder, null));
