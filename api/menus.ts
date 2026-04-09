/**
 * Menu API Service
 * Base URL: /api/v1/menus
 */

import type {
	ActiveMenusResponse,
	CreateMenuRequest,
	MenuHierarchyResponse,
	UpdateMenuRequest,
} from '../types/backend';
import apiRequest from './helper';

// ============================================================================
// MENU API SERVICE
// ============================================================================

export const menuApi = {
	/**
	 * Create Menu
	 * POST /api/v1/menus
	 */
	createMenu: async (data: CreateMenuRequest): Promise<any> => {
		return apiRequest<any>('/menus', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Get All Menus
	 * GET /api/v1/menus
	 */
	getAllMenus: async (): Promise<any> => {
		return apiRequest<any>('/menus');
	},

	/**
	 * Get Active Menus
	 * GET /api/v1/menus/active
	 */
	getActiveMenus: async (): Promise<ActiveMenusResponse> => {
		return apiRequest<ActiveMenusResponse>('/menus/active');
	},

	/**
	 * Get Parent Menus
	 * GET /api/v1/menus/parents
	 */
	getParentMenus: async (): Promise<any> => {
		return apiRequest<any>('/menus/parents');
	},

	/**
	 * Get Menu Hierarchy
	 * GET /api/v1/menus/hierarchy
	 */
	getMenuHierarchy: async (): Promise<MenuHierarchyResponse> => {
		return apiRequest<MenuHierarchyResponse>('/menus/hierarchy');
	},

	/**
	 * Get Menu by UUID
	 * GET /api/v1/menus/:uuid
	 */
	getMenuByUUID: async (uuid: string): Promise<any> => {
		return apiRequest<any>(`/menus/${uuid}`);
	},

	/**
	 * Get Sub Menus
	 * GET /api/v1/menus/:uuid/submenus
	 */
	getSubMenus: async (uuid: string): Promise<any> => {
		return apiRequest<any>(`/menus/${uuid}/submenus`);
	},

	/**
	 * Update Menu
	 * PUT /api/v1/menus/:uuid
	 */
	updateMenu: async (uuid: string, data: UpdateMenuRequest): Promise<any> => {
		return apiRequest<any>(`/menus/${uuid}`, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	},

	/**
	 * Deactivate Menu
	 * PATCH /api/v1/menus/:uuid/deactivate
	 */
	deactivateMenu: async (
		uuid: string,
		lastActionBy: string = 'administrator'
	): Promise<any> => {
		return apiRequest<any>(`/menus/${uuid}/deactivate`, {
			method: 'PATCH',
			body: JSON.stringify({
				last_action_by: lastActionBy,
			}),
		});
	},
};
