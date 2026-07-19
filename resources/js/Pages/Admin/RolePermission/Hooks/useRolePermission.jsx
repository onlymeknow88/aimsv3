import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const BASE = "/api/admin/role-permissions";

export default function useRolePermission(initialModuleId) {
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState(initialModuleId || null);
    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Permission change tracking
    const [localPermissions, setLocalPermissions] = useState({});
    const [changedKeys, setChangedKeys] = useState(new Set());
    const [updating, setUpdating] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Modal state for Add / Edit Role
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleSlug, setNewRoleSlug] = useState("");
    const [editRoleName, setEditRoleName] = useState("");
    const [editRoleSlug, setEditRoleSlug] = useState("");

    // Fetch Role & Permission Matrix
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(BASE, {
                params: selectedModule ? { module_id: selectedModule } : {},
            });
            const result = response.data?.result || {};
            setModules(result.modules || []);
            if (result.selectedModuleId && !selectedModule) {
                setSelectedModule(result.selectedModuleId);
            }
            setRoles(result.roles || []);
            setMenus(result.menus || []);
            setPermissions(result.permissions || []);
        } catch (e) {
            setError("Gagal memuat data role dan permission.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [selectedModule]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Map permissions when they are loaded or refreshed
    useEffect(() => {
        const map = {};
        permissions.forEach((p) => {
            const base = `${p.role_id}::${p.menu_id}`;
            map[`${base}::can_view`] = Boolean(p.can_view);
            map[`${base}::can_create`] = Boolean(p.can_create);
            map[`${base}::can_edit`] = Boolean(p.can_edit);
            map[`${base}::can_delete`] = Boolean(p.can_delete);
            map[`${base}::can_approval`] = Boolean(p.can_approval);
        });
        setLocalPermissions(map);
        setChangedKeys(new Set());
    }, [permissions]);

    const makeSlug = (value) =>
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^_|_$)/g, "");

    const handleModuleChange = (moduleId) => {
        setSelectedModule(moduleId);
    };

    const getPermValue = (roleId, menuId, field) =>
        Boolean(localPermissions[`${roleId}::${menuId}::${field}`]);

    const handleToggle = (roleId, menuId, field) => {
        const key = `${roleId}::${menuId}::${field}`;
        setLocalPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
        setChangedKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const handleCancel = () => {
        const map = {};
        permissions.forEach((p) => {
            const base = `${p.role_id}::${p.menu_id}`;
            map[`${base}::can_view`] = Boolean(p.can_view);
            map[`${base}::can_create`] = Boolean(p.can_create);
            map[`${base}::can_edit`] = Boolean(p.can_edit);
            map[`${base}::can_delete`] = Boolean(p.can_delete);
            map[`${base}::can_approval`] = Boolean(p.can_approval);
        });
        setLocalPermissions(map);
        setChangedKeys(new Set());
    };

    const handleSave = async () => {
        if (changedKeys.size === 0) return;
        setUpdating(true);
        try {
            const changes = [...changedKeys].map((key) => {
                const parts = key.split("::");
                return {
                    role_id: parts[0],
                    menu_id: parts[1],
                    field: parts.slice(2).join("::"),
                    value: Boolean(localPermissions[key]),
                };
            });
            await axios.post(`${BASE}/bulk-update`, { changes });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2500);
            setChangedKeys(new Set());
            fetchData();
        } catch (err) {
            console.error("Gagal menyimpan permissions", err);
            alert("Gagal menyimpan perubahan permission.");
        } finally {
            setUpdating(false);
        }
    };

    const handleAddRole = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE}/roles`, {
                module_id: selectedModule,
                name: newRoleName,
                slug: newRoleSlug,
            });
            setShowAddRoleModal(false);
            setNewRoleName("");
            setNewRoleSlug("");
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal membuat role.";
            alert(msg);
        }
    };

    const openEditRoleModal = (role) => {
        setEditingRole(role);
        setEditRoleName(role.name);
        setEditRoleSlug(role.slug);
    };

    const closeEditRoleModal = () => {
        setEditingRole(null);
        setEditRoleName("");
        setEditRoleSlug("");
    };

    const handleEditRole = async (e) => {
        e.preventDefault();
        if (!editingRole) return;
        try {
            await axios.put(`${BASE}/roles/${editingRole.id}`, {
                module_id: selectedModule,
                name: editRoleName,
                slug: editRoleSlug,
            });
            closeEditRoleModal();
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal memperbarui role.";
            alert(msg);
        }
    };

    const handleDeleteRole = async (roleId, roleName) => {
        if (
            !confirm(
                `Apakah Anda yakin ingin menghapus role "${roleName}"?\n\nPerhatian:\n- Semua permission role ini akan dihapus\n- User yang memiliki role ini akan kehilangan akses`
            )
        ) {
            return;
        }
        try {
            await axios.delete(`${BASE}/roles/${roleId}`);
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal menghapus role.";
            alert(msg);
        }
    };

    return {
        modules,
        selectedModule,
        roles,
        menus,
        permissions,
        loading,
        error,
        localPermissions,
        changedKeys,
        updating,
        saveSuccess,
        handleModuleChange,
        getPermValue,
        handleToggle,
        handleCancel,
        handleSave,
        // add role modal
        showAddRoleModal,
        setShowAddRoleModal,
        newRoleName,
        setNewRoleName,
        newRoleSlug,
        setNewRoleSlug,
        handleAddRole,
        makeSlug,
        // edit role modal
        editingRole,
        openEditRoleModal,
        closeEditRoleModal,
        editRoleName,
        setEditRoleName,
        editRoleSlug,
        setEditRoleSlug,
        handleEditRole,
        handleDeleteRole,
    };
}
