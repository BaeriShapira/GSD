import { useState, useRef, useEffect } from "react";

/**
 * Custom hook for managing dropdown menu state with click-outside detection
 * @param {Object} options - Configuration options
 * @param {Object} options.actions - Action handlers { onEdit, onDelete, onMove, etc. }
 * @returns {Object} Menu state and handlers
 */
export function useDropdownMenu(options = {}) {
    const { actions = {} } = options;
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showMenu]);

    // Toggle menu visibility
    function handleMenuClick(e) {
        e.stopPropagation();
        setShowMenu(!showMenu);
    }

    // Create action handlers that close the menu and call the original handler
    const createActionHandler = (handler) => (e) => {
        e.stopPropagation();
        setShowMenu(false);
        handler?.();
    };

    // Generate handlers for all provided actions
    const handlers = {};
    Object.keys(actions).forEach(key => {
        handlers[key] = createActionHandler(actions[key]);
    });

    return {
        showMenu,
        setShowMenu,
        menuRef,
        handleMenuClick,
        handlers,
    };
}
