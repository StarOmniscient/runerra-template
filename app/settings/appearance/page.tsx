"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { THEMES } from "@/app/themes";
import type { UserTheme } from "@/types/usertheme";
import { X } from "lucide-react";

interface ThemeDescriptor {
  key: string;
  name: string;
  type: "System" | "User"; // stricter than just `string`
  css?: string; // only present for User themes
}

type GroupedThemes = Record<"System" | "User", ThemeDescriptor[]>;


const ThemeEditorModal = ({
	theme,
	isOpen,
	onClose,
	onSave
}: {
	theme: UserTheme | null;
	isOpen: boolean;
	onClose: () => void;
	onSave: (updatedTheme: UserTheme) => void;
}) => {
	const [name, setName] = useState("");
	const [css, setCss] = useState("");

	useEffect(() => {
		if (theme) {
			setName(theme.name);
			setCss(theme.css);
		} else {
			setName("");
			setCss(`.my-theme {
  --background: oklch(0.15 0.01 30);
  --foreground: oklch(0.92 0.01 30);
  --primary: oklch(0.7 0.18 15);
  --primary-foreground: oklch(0.98 0.005 30);
  --secondary: oklch(0.35 0.05 10);
  --secondary-foreground: var(--foreground);
  --accent: oklch(0.6 0.1 60);
  --accent-foreground: var(--primary-foreground);
  --muted: oklch(0.25 0.01 30);
  --muted-foreground: oklch(0.65 0.01 30);
  --border: oklch(0.3 0.01 30);
  --input: var(--border);
  --card: oklch(0.2 0.015 30);
  --card-foreground: var(--foreground);
  --popover: var(--card);
  --popover-foreground: var(--foreground);
  --ring: var(--primary);
}`);
		}
	}, [theme]);

	if (!isOpen) return null;

	const handleSave = () => {
		if (!name.trim()) return;
		onSave({ ...theme!, name: name.trim(), css });
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-background border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
				<div className="p-6">
					<h3 className="text-lg font-medium mb-4">
						{theme ? "Edit Theme" : "Create New Theme"}
					</h3>

					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-1 block">Theme Name</label>
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="My Custom Theme"
								className="w-full p-2 border rounded bg-background text-foreground"
							/>
						</div>

						<div>
							<label className="text-sm font-medium mb-1 block">CSS Variables</label>
							<textarea
								value={css}
								onChange={(e) => setCss(e.target.value)}
								placeholder={`.my-theme {\n  --primary: #6b46c1;\n  ...\n}`}
								className="w-full h-60 font-mono text-sm p-2 border rounded bg-background text-foreground"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Start with <code>.your-theme-name {'{'}</code>
							</p>
						</div>
					</div>

					<div className="flex justify-end gap-2 mt-6">
						<Button variant="outline" onClick={onClose}>Cancel</Button>
						<Button onClick={handleSave}>Save</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

const ColorSwatch = ({ color, label }: { color: string; label: string }) => {
	return (
		<div className="flex flex-col items-center">
			<div
				className="w-6 h-6 rounded-sm border border-border"
				style={{ backgroundColor: color }}
				title={color}
			/>
			<span className="text-xs mt-1">{label}</span>
		</div>
	);
};

const getThemeColor = (themeClass: string, colorVar: string): string => {
	const tempElement = document.createElement("div");
	tempElement.className = themeClass;
	tempElement.style.position = "absolute";
	tempElement.style.visibility = "hidden";
	document.body.appendChild(tempElement);

	const computedStyle = getComputedStyle(tempElement);
	const colorValue = computedStyle.getPropertyValue(colorVar).trim();

	document.body.removeChild(tempElement);
	return colorValue || "transparent";
};

const getTextColorForTheme = (themeClass: string): string => {
	const tempElement = document.createElement("div");
	tempElement.className = themeClass;
	tempElement.style.position = "absolute";
	tempElement.style.visibility = "hidden";
	document.body.appendChild(tempElement);

	const computedStyle = getComputedStyle(tempElement);
	const bgColorValue = computedStyle.getPropertyValue("--background").trim();
	document.body.removeChild(tempElement);

	const match = bgColorValue.match(/oklch\(\s*([\d.]+)\s+/);
	if (match) {
		const lightness = parseFloat(match[1]);
		return lightness > 0.5 ? "text-foreground" : "text-white";
	}
	return "text-foreground";
};

export default function AppearanceSettings() {
	const { theme, setTheme } = useTheme();
	const [themeColors, setThemeColors] = useState<Record<string, { primary: string; secondary: string; accent: string; background: string }>>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingTheme, setEditingTheme] = useState<UserTheme | null>(null);
	const [refreshColors, setRefreshColors] = useState(0);
	const [allThemes, setAllThemes] = useState<any[]>([]);
	const [injectedClass, setInjectedClass] = useState<string | null>(null);

	useEffect(() => {
		const fetchColors = () => {
			const colors: Record<string, { primary: string; secondary: string; accent: string; background: string }> = {};
			const userThemes = JSON.parse(localStorage.getItem("user-themes") || "[]").map((theme: UserTheme) => {
				const match = theme.css.match(/\.([^\s{]+)/);
				return { name: theme.name, key: match ? match[1] : null, type: "User", css: theme.css };
			});
			const all = [...THEMES, ...userThemes];
			setAllThemes(all);

			all.forEach(({ key, css }) => {
				let tempStyle: HTMLStyleElement | null = null;
				if (css && key?.startsWith("user-")) {
					tempStyle = document.createElement("style");
					tempStyle.id = `temp-user-theme-${key}`;
					tempStyle.textContent = css;
					document.head.appendChild(tempStyle);
				}

				colors[key] = {
					primary: getThemeColor(key, "--primary"),
					secondary: getThemeColor(key, "--secondary"),
					accent: getThemeColor(key, "--accent"),
					background: getThemeColor(key, "--background"),
				};

				if (tempStyle) {
					document.head.removeChild(tempStyle);
				}
			});

			setThemeColors(colors);
		};

		fetchColors();
	}, [refreshColors]);

	const switchTheme = (key: string) => {
		const userTheme = allThemes.find(t => t.key === key && t.type === "User");
		if (userTheme) {
			const classMatch = userTheme.css.match(/\.([^\s{]+)/);
			const className = classMatch ? classMatch[1] : key;

			if (!document.getElementById(`user-theme-${className}`)) {
				const style = document.createElement("style");
				style.id = `user-theme-${className}`;
				style.textContent = userTheme.css;
				document.head.appendChild(style);
			}

			if (injectedClass && injectedClass !== className) {
				const old = document.getElementById(`user-theme-${injectedClass}`);
				if (old) old.remove();
			}

			document.documentElement.className = className;
			setInjectedClass(className);
			setTheme(className);
		} else {
			if (injectedClass) {
				const el = document.getElementById(`user-theme-${injectedClass}`);
				if (el) el.remove();
				setInjectedClass(null);
			}
			setTheme(key);
		}
	};

	const groupedThemes = allThemes.reduce((acc, t) => {
		if (!acc[t.type]) acc[t.type] = [];
		acc[t.type].push(t);
		return acc;
	}, {} as GroupedThemes);

	const handleSaveTheme = (updatedTheme: UserTheme) => {
		const existingThemes = JSON.parse(localStorage.getItem("user-themes") || "[]");
		const themesArray = Array.isArray(existingThemes) ? existingThemes : [];

		const classMatch = updatedTheme.css.match(/\.([^\s{]+)/);
		const originalClass = classMatch ? classMatch[1] : updatedTheme.name.replace(/\s+/g, "-").toLowerCase();
		const newClass = `user-${originalClass}`;
		const newCss = updatedTheme.css.replace(/\.([^\s{]+)/, `.${newClass}`);
		const themeToSave = { ...updatedTheme, key: newClass, css: newCss };

		const index = themesArray.findIndex(t => t.name === updatedTheme.name);
		if (index >= 0) themesArray[index] = themeToSave;
		else themesArray.push(themeToSave);

		localStorage.setItem("user-themes", JSON.stringify(themesArray));
		setRefreshColors(prev => prev + 1);
		setIsModalOpen(false);
		setEditingTheme(null);
	};

	return (
		<div className="space-y-6">
			<p className="text-lg font-medium">
				Current Theme:{" "}
				<span className="font-semibold">
					{THEMES.find(t => t.key === theme)?.name || theme}
				</span>
			</p>

			{Object.entries(groupedThemes).map(([type, themes]: any) => (
				<div key={type} className="space-y-2">
					<h2 className="text-xl font-semibold capitalize">{type} Themes</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{themes.map(({ key, name }: ThemeDescriptor) => {
							const isCurrent = theme === key;
							const colors = themeColors[key];
							const textColorClass = colors ? getTextColorForTheme(key) : "text-foreground";

							return (
								<div
									key={key}
									className={`group border rounded-lg p-4 flex flex-col relative ${isCurrent ? "ring-2 ring-ring ring-offset-2" : "border-border hover:border-destructive/30"}`}
								>
									{/* Delete X button — User Themes only */}
									{type === "User" && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

												const existingThemes = JSON.parse(localStorage.getItem("user-themes") || "[]") as UserTheme[];
												const updatedThemes = existingThemes.filter(t => t.name !== name);
												localStorage.setItem("user-themes", JSON.stringify(updatedThemes));

												const themeToDelete = allThemes.find(t => t.key === key && t.type === "User");
												if (themeToDelete) {
													const classMatch = themeToDelete.css.match(/\.([^\s{]+)/);
													const className = classMatch ? classMatch[1] : key;

													const styleTag = document.getElementById(`user-theme-${className}`);
													if (styleTag) styleTag.remove();

													if (isCurrent) setTheme("dark");
													if (injectedClass === className) setInjectedClass(null);
												}

												setRefreshColors(prev => prev + 1);
											}}
											className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-destructive hover:text-destructive/80 rounded-full hover:bg-destructive/10 focus:outline-none"
											aria-label="Delete theme"
										>
											<X className="w-4 h-4" />
										</button>
									)}

									<div className="flex justify-between items-start mb-2">
										<h3 className={`${textColorClass} font-medium`}>{name}</h3>
										<div className="gap-1 mt-2">
									
											{type === "User" && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														const themeToEdit = allThemes.find(t => t.key === key && t.type === "User");
														if (themeToEdit) {
															setEditingTheme({
																name: themeToEdit.name,
																css: themeToEdit.css,
																id: themeToEdit.id,
															});
															setIsModalOpen(true);
														}
													}}
													className="text-xs"
												>
													Edit
												</Button>
												
												
											)}

											<Button
												variant={isCurrent ? "secondary" : "outline"}
												size="sm"
												onClick={() => switchTheme(key)}
												className="text-xs"
												disabled={!colors}
											>
												{isCurrent ? "Active" : "Apply"}
											</Button>
										</div>
									</div>

									{colors && (
										<div className="flex space-x-2 justify-center mt-auto">
											<ColorSwatch color={colors.primary} label="Primary" />
											<ColorSwatch color={colors.secondary} label="Secondary" />
											<ColorSwatch color={colors.accent} label="Accent" />
										</div>
									)}
									{!colors && (
										<div className="flex justify-center items-center mt-auto h-6">
											<span className="text-sm text-muted-foreground">Loading...</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			))}
			<Button
				onClick={() => {
					setEditingTheme(null);
					setIsModalOpen(true);
				}}
			>
				Create New Theme
			</Button>

			<ThemeEditorModal
				key={isModalOpen ? (editingTheme ? `edit-${editingTheme.name}` : "create") : "closed"}
				theme={editingTheme}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setEditingTheme(null);
				}}
				onSave={handleSaveTheme}
			/>
		</div>
	);
}