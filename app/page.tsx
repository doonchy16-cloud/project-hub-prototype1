'use client';

import { useMemo, useState } from 'react';

type SharedProject = {
  id: number;
  title: string;
  creator: string;
  category: string;
  tags: string[];
  thumbnail: string;
};

type UserProject = {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  visibility: 'private' | 'public';
  thumbnail: string;
  createdAt: string;
};

const sharedProjectsSeed: SharedProject[] = [
  { id: 1, title: 'Minimal Portfolio Website', creator: 'Ava Chen', category: 'Web Design', tags: ['portfolio', 'branding', 'landing'], thumbnail: 'MP' },
  { id: 2, title: 'Community Garden Tracker', creator: 'Daniel Ross', category: 'Productivity', tags: ['community', 'tracker', 'dashboard'], thumbnail: 'CG' },
  { id: 3, title: 'Family Budget Dashboard', creator: 'Priya Singh', category: 'Finance', tags: ['budget', 'family', 'planning'], thumbnail: 'FB' },
  { id: 4, title: 'Study Planner Pro', creator: 'Lina Patel', category: 'Education', tags: ['study', 'school', 'planner'], thumbnail: 'SP' },
  { id: 5, title: 'Remodel Estimate Manager', creator: 'Marcus Lee', category: 'Construction', tags: ['remodel', 'estimating', 'operations'], thumbnail: 'RE' },
  { id: 6, title: 'Recipe Organizer', creator: 'Sofia Alvarez', category: 'Lifestyle', tags: ['recipes', 'food', 'organization'], thumbnail: 'RO' }
];

const categories = ['General', 'Web Design', 'Finance', 'Education', 'Construction', 'Lifestyle', 'Productivity', 'Creative'];
const pages = ['home', 'my projects', 'settings', 'account profile'] as const;
type Page = (typeof pages)[number];

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`card ${className}`.trim()}>{children}</div>;
}

function Badge({ children, filled = false }: { children: React.ReactNode; filled?: boolean }) {
  return <span className={filled ? 'badge badge-filled' : 'badge'}>{children}</span>;
}

export default function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [brightness, setBrightness] = useState(100);
  const [notifications, setNotifications] = useState(true);
  const [search, setSearch] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([2, 5]);
  const [activities, setActivities] = useState<string[]>([
    'Opened the platform',
    'Viewed featured community projects',
    'Saved Community Garden Tracker'
  ]);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('General');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [projectThumbnail, setProjectThumbnail] = useState('');
  const [projectVisibility, setProjectVisibility] = useState<'private' | 'public'>('private');

  const filteredProjects = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sharedProjectsSeed;
    return sharedProjectsSeed.filter((project) =>
      [project.title, project.creator, project.category, ...project.tags].some((item) =>
        item.toLowerCase().includes(q)
      )
    );
  }, [search]);

  const favoriteProjects = useMemo(
    () => sharedProjectsSeed.filter((project) => favoriteIds.includes(project.id)),
    [favoriteIds]
  );

  const initials = useMemo(() => (email ? email.slice(0, 2).toUpperCase() : 'U'), [email]);
  const publicCount = useMemo(() => userProjects.filter((project) => project.visibility === 'public').length, [userProjects]);
  const paymentProvided = Boolean(cardName || cardNumber || expiry || cvc);

  function addActivity(message: string) {
    setActivities((prev) => [message, ...prev].slice(0, 8));
  }

  function toggleFavorite(id: number, title: string) {
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      addActivity(exists ? `Removed ${title} from favorites` : `Saved ${title} to favorites`);
      return exists ? prev.filter((value) => value !== id) : [id, ...prev];
    });
  }

  function createProject() {
    if (!projectTitle.trim()) return;
    const newProject: UserProject = {
      id: Date.now(),
      title: projectTitle.trim(),
      category: projectCategory,
      description: projectDescription.trim(),
      tags: projectTags.split(',').map((tag) => tag.trim()).filter(Boolean),
      visibility: projectVisibility,
      thumbnail: projectThumbnail.trim() || projectTitle.trim().slice(0, 2).toUpperCase(),
      createdAt: new Date().toLocaleDateString()
    };

    setUserProjects((prev) => [newProject, ...prev]);
    setProjectTitle('');
    setProjectCategory('General');
    setProjectDescription('');
    setProjectTags('');
    setProjectThumbnail('');
    setProjectVisibility('private');
    setPage('my projects');
    addActivity(`Created ${newProject.title}`);
  }

  const appStyle = {
    filter: `brightness(${brightness}%)`
  } as const;

  if (!isSignedIn) {
    return (
      <main className={`app-shell ${theme}`} style={appStyle}>
        <section className="auth-layout">
          <div className="hero-block">
            <div className="eyebrow">Google-style project platform prototype</div>
            <h1>Sign in and start building projects.</h1>
            <p>
              This Vercel-ready prototype includes sign-in, optional payment, searchable community projects,
              favorites, public/private visibility, recent activity, settings, and a project workspace.
            </p>
            <div className="hero-grid">
              <Card><strong>Search</strong><span>Find projects created by other users.</span></Card>
              <Card><strong>Favorites</strong><span>Save projects you want to revisit later.</span></Card>
              <Card><strong>Settings</strong><span>Light mode, dark mode, brightness, and notifications.</span></Card>
            </div>
          </div>

          <Card className="auth-card">
            <h2>Create your account</h2>
            <p className="muted">Email and phone are required. Payment is optional in this prototype.</p>

            <label>Email address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />

            <label>Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />

            <div className="payment-box">
              <div className="row between center">
                <h3>Optional payment details</h3>
                <Badge filled>Optional</Badge>
              </div>
              <label>Cardholder name</label>
              <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name on card" />
              <label>Card number</label>
              <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" />
              <div className="row two-col">
                <div>
                  <label>Expiry</label>
                  <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
                </div>
                <div>
                  <label>CVC</label>
                  <input value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" />
                </div>
              </div>
              <p className="muted small">
                {paymentProvided ? 'Payment details entered for prototype purposes only.' : 'You can skip payment and continue.'}
              </p>
            </div>

            <button
              className="primary-button"
              disabled={!email || !phone}
              onClick={() => {
                setIsSignedIn(true);
                addActivity(paymentProvided ? 'Entered optional payment info' : 'Skipped optional payment info');
              }}
            >
              Continue to Home
            </button>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className={`app-shell ${theme}`} style={appStyle}>
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="eyebrow">Project Hub</div>
            <h2>Workspace</h2>
          </div>

          <label>Pages</label>
          <select value={page} onChange={(e) => setPage(e.target.value as Page)}>
            {pages.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <div className="nav-list">
            {pages.map((item) => (
              <button
                key={item}
                className={item === page ? 'nav-button active' : 'nav-button'}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <Card className="activity-card">
            <h3>Recent activity</h3>
            <div className="stack gap-sm">
              {activities.map((activity, idx) => (
                <div key={`${activity}-${idx}`} className="activity-item">• {activity}</div>
              ))}
            </div>
          </Card>
        </aside>

        <section className="content-area">
          <div className="topbar">
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for projects other people made"
            />
            <div className="topbar-actions">
              <button className="icon-button" onClick={() => setPage('settings')}>⚙</button>
              <button className="profile-button" onClick={() => setPage('account profile')}>
                <span className="avatar">{initials}</span>
                <span>Profile</span>
              </button>
            </div>
          </div>

          {page === 'home' && (
            <div className="grid-main">
              <Card>
                <div className="section-head">
                  <div>
                    <h2>Discover projects</h2>
                    <p className="muted">Search shared projects by title, creator, category, or tag.</p>
                  </div>
                </div>
                <div className="project-grid">
                  {filteredProjects.length > 0 ? filteredProjects.map((project) => {
                    const isFavorite = favoriteIds.includes(project.id);
                    return (
                      <Card key={project.id} className="project-card inner">
                        <div className="row between start">
                          <div className="row start center gap-md">
                            <div className="thumb">{project.thumbnail}</div>
                            <Badge>{project.category}</Badge>
                          </div>
                          <button className="icon-button" onClick={() => toggleFavorite(project.id, project.title)}>
                            {isFavorite ? '♥' : '♡'}
                          </button>
                        </div>
                        <h3>{project.title}</h3>
                        <p className="muted">Created by {project.creator}</p>
                        <div className="tag-row">
                          {project.tags.map((tag) => <Badge key={tag}>#{tag}</Badge>)}
                        </div>
                      </Card>
                    );
                  }) : <div className="empty-box">No shared projects matched your search.</div>}
                </div>
              </Card>

              <div className="stack gap-lg">
                <Card>
                  <h3>Saved projects</h3>
                  <p className="muted">Your favorited community projects.</p>
                  <div className="stack gap-sm top-space">
                    {favoriteProjects.length > 0 ? favoriteProjects.map((project) => (
                      <div key={project.id} className="saved-item">
                        <div>
                          <strong>{project.title}</strong>
                          <div className="muted small">{project.category}</div>
                        </div>
                        <span>♥</span>
                      </div>
                    )) : <div className="empty-box">No saved projects yet.</div>}
                  </div>
                </Card>

                <Card>
                  <h3>Planned additions</h3>
                  <div className="stack gap-sm top-space">
                    <div className="list-box">Comments on shared projects</div>
                    <div className="list-box">Invited collaborators and permissions</div>
                    <div className="list-box">Shareable project links</div>
                    <div className="list-box">Real thumbnail uploads</div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {page === 'my projects' && (
            <div className="stack gap-lg">
              <div className="row between center wrap">
                <div>
                  <h2>My Projects</h2>
                  <p className="muted">Manage the projects you created.</p>
                </div>
                <button className="primary-button" onClick={createProject}>Create Project</button>
              </div>

              <Card>
                <h3>Create a project</h3>
                <div className="form-grid top-space">
                  <div>
                    <label>Project title</label>
                    <input value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="Enter project name" />
                  </div>
                  <div>
                    <label>Category</label>
                    <select value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}>
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Description</label>
                    <input value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Short description" />
                  </div>
                  <div>
                    <label>Tags</label>
                    <input value={projectTags} onChange={(e) => setProjectTags(e.target.value)} placeholder="Comma-separated tags" />
                  </div>
                  <div>
                    <label>Thumbnail label</label>
                    <input value={projectThumbnail} onChange={(e) => setProjectThumbnail(e.target.value)} placeholder="Optional initials or short label" />
                  </div>
                  <div>
                    <label>Visibility</label>
                    <select value={projectVisibility} onChange={(e) => setProjectVisibility(e.target.value as 'private' | 'public')}>
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                </div>
              </Card>

              {userProjects.length === 0 ? (
                <div className="empty-big">No projects yet.</div>
              ) : (
                <div className="project-grid user-grid">
                  {userProjects.map((project) => (
                    <Card key={project.id} className="inner">
                      <div className="row between start">
                        <div className="row gap-md center">
                          <div className="thumb">{project.thumbnail}</div>
                          <Badge>{project.category}</Badge>
                        </div>
                        <Badge filled>{project.visibility === 'public' ? 'Public' : 'Private'}</Badge>
                      </div>
                      <h3>{project.title}</h3>
                      <p className="muted">{project.description || 'No description provided.'}</p>
                      <div className="tag-row">
                        {project.tags.length > 0 ? project.tags.map((tag) => <Badge key={tag}>{tag}</Badge>) : <span className="muted small">No tags yet</span>}
                      </div>
                      <div className="list-box top-space">Collaboration: sharing and team editing can be added later.</div>
                      <div className="row between center top-space">
                        <span className="muted small">Created on {project.createdAt}</span>
                        <button className="secondary-button" disabled>Share later</button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {page === 'settings' && (
            <div className="settings-grid">
              <Card>
                <h2>Display settings</h2>
                <div className="setting-box top-space">
                  <div>
                    <strong>Dark / Light Mode</strong>
                    <div className="muted small">Switch your preferred theme.</div>
                  </div>
                  <button className="secondary-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </button>
                </div>
                <div className="setting-box top-space">
                  <div className="row between center">
                    <div>
                      <strong>Brightness</strong>
                      <div className="muted small">Adjust the app brightness.</div>
                    </div>
                    <span>{brightness}%</span>
                  </div>
                  <input type="range" min="60" max="120" step="1" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
                </div>
              </Card>

              <Card>
                <h2>Notifications</h2>
                <div className="setting-box top-space">
                  <div>
                    <strong>Enable notifications</strong>
                    <div className="muted small">Project updates, alerts, and reminders.</div>
                  </div>
                  <label className="toggle-row">
                    <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                    <span>{notifications ? 'On' : 'Off'}</span>
                  </label>
                </div>
              </Card>
            </div>
          )}

          {page === 'account profile' && (
            <div className="stack gap-lg">
              <Card>
                <div className="row gap-md center">
                  <span className="avatar large">{initials}</span>
                  <div>
                    <h2>{email || 'User'}</h2>
                    <p className="muted">{phone || 'No phone number added'}</p>
                  </div>
                </div>
              </Card>

              <div className="stats-grid">
                <Card><div className="stat-label">Projects created</div><div className="stat-value">{userProjects.length}</div></Card>
                <Card><div className="stat-label">Public projects</div><div className="stat-value">{publicCount}</div></Card>
                <Card><div className="stat-label">Saved favorites</div><div className="stat-value">{favoriteProjects.length}</div></Card>
                <Card><div className="stat-label">Notifications</div><div className="stat-value">{notifications ? 'On' : 'Off'}</div></Card>
              </div>

              <Card>
                <h3>Upcoming collaboration support</h3>
                <p className="muted">
                  Next-phase enhancements can include invited collaborators, edit permissions, comments,
                  project links, and shared workspaces.
                </p>
                <div className="top-space">
                  <button className="secondary-button" onClick={() => setIsSignedIn(false)}>Sign out</button>
                </div>
              </Card>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
