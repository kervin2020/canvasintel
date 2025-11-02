# 🎯 Exercices Pratiques - Guide d'Apprentissage Progressif

Ce document propose des exercices pratiques pour chaque module du projet. Commencez par le début et progressez étape par étape.

---

## 📚 Module 1 : Fondations (Base de données)

### Exercice 1.1 : Créer une nouvelle table `maintenance_requests`

**Objectif :** Comprendre la création de tables avec relations dans Drizzle.

**Instructions :**
1. Dans `shared/schema.ts`, créer :
   - Enum `maintenanceStatusEnum` : `["pending", "in_progress", "completed", "cancelled"]`
   - Table `maintenanceRequests` avec :
     - `id` (UUID, primary key)
     - `hotelId` (foreign key vers hotels, cascade delete)
     - `roomId` (foreign key vers rooms, restrict delete)
     - `userId` (foreign key vers users, set null - qui a créé la requête)
     - `title` (text, not null)
     - `description` (text)
     - `status` (enum, default "pending")
     - `priority` (text : "low", "medium", "high")
     - `createdAt` (timestamp, default now)
   - Relations appropriées

2. Créer le schéma Zod `insertMaintenanceRequestSchema`
3. Exécuter `npm run db:push` pour créer la table

**Questions de réflexion :**
- Pourquoi `onDelete: "restrict"` sur `roomId` ? (Réponse : On ne peut pas supprimer une chambre avec des requêtes actives)
- Pourquoi `onDelete: "set null"` sur `userId` ? (Réponse : Si un utilisateur est supprimé, on garde l'historique mais on perd l'info de qui a créé)

**Validation :**
```bash
# Vérifier que la table existe
psql $DATABASE_URL -c "\d maintenance_requests"
```

---

### Exercice 1.2 : Ajouter des indexes pour performance

**Objectif :** Optimiser les requêtes fréquentes.

**Instructions :**
1. Identifier les colonnes souvent utilisées dans WHERE :
   - `maintenance_requests.hotel_id`
   - `maintenance_requests.room_id`
   - `maintenance_requests.status`

2. Créer un fichier de migration manuelle ou utiliser Drizzle :
```typescript
// Dans une migration ou directement
await db.execute(sql`
  CREATE INDEX idx_maintenance_requests_hotel_id 
  ON maintenance_requests(hotel_id);
`);
```

**Questions de réflexion :**
- Pourquoi indexer `hotel_id` ? (Toutes les requêtes filtrent par hôtel)
- Quand NE PAS indexer ? (Colonnes peu utilisées, très petites tables)

---

## 🔐 Module 2 : Authentification et Sécurité

### Exercice 2.1 : Système de refresh tokens

**Objectif :** Améliorer la sécurité avec des tokens courts + refresh tokens.

**Instructions :**
1. Modifier `server/auth.ts` :
   - `generateToken` : Token court (15 minutes)
   - `generateRefreshToken` : Token long (30 jours), stocké en DB
   - Créer une table `refreshTokens` (id, userId, token, expiresAt)

2. Route `/api/auth/refresh` :
   - Vérifie le refresh token
   - Génère un nouveau access token
   - Retourne le nouveau token

3. Frontend : Intercepter les 401 et faire un refresh automatique

**Code de départ :**
```typescript
// Table refresh tokens
export const refreshTokens = pgTable("refresh_tokens", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Route refresh
app.post("/api/auth/refresh", async (req, res) => {
  // TODO: Implémenter
});
```

**Validation :**
- Tester avec un token expiré
- Vérifier que le refresh fonctionne
- Vérifier que le refresh token est invalidé après utilisation

---

### Exercice 2.2 : Middleware de permissions par rôle

**Objectif :** Restreindre l'accès selon le rôle.

**Instructions :**
1. Améliorer `requireRole` pour vérifier aussi le `hotelId` :
```typescript
export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Vérifier l'authentification (req.user existe)
    // 2. Vérifier que le rôle est autorisé
    // 3. Si route avec :hotelId, vérifier que req.user.hotelId correspond
    // 4. Sinon, passer au suivant
  };
}
```

2. Utiliser dans les routes :
```typescript
app.delete("/api/rooms/:id", 
  authenticateToken,
  requireRole("owner", "receptionist"),
  async (req, res) => { ... }
);
```

**Questions de réflexion :**
- Pourquoi vérifier `hotelId` même si l'utilisateur est authentifié ?
- Comment gérer le cas du super_admin (pas de hotelId) ?

---

## 🌐 Module 3 : Backend API

### Exercice 3.1 : Recherche de clients avec pagination

**Objectif :** Implémenter une recherche efficace avec pagination.

**Instructions :**
1. Ajouter méthode dans `storage.ts` :
```typescript
async searchGuests(
  hotelId: string,
  query: string,
  limit: number = 10,
  offset: number = 0
): Promise<{ guests: Guest[], total: number }> {
  // Utiliser LIKE pour recherche partielle sur name, email, phone
  // Retourner aussi le total (COUNT(*))
}
```

2. Route GET `/api/hotels/:hotelId/guests/search`
   - Paramètres query : `q`, `limit`, `offset`
   - Validation avec Zod
   - Retourner `{ guests, total, limit, offset }`

3. Utiliser `ilike()` de Drizzle (case-insensitive) :
```typescript
import { or, ilike } from "drizzle-orm";

const results = await db.select()
  .from(guests)
  .where(
    and(
      eq(guests.hotelId, hotelId),
      or(
        ilike(guests.name, `%${query}%`),
        ilike(guests.email, `%${query}%`),
        ilike(guests.phone, `%${query}%`)
      )
    )
  )
  .limit(limit)
  .offset(offset);
```

**Validation :**
- Tester avec différents termes
- Vérifier la pagination (page 1, page 2)
- Tester avec query vide (retourner tous les clients paginés)

---

### Exercice 3.2 : Endpoint de statistiques du dashboard

**Objectif :** Créer un endpoint optimisé pour le dashboard.

**Instructions :**
1. Route `GET /api/hotels/:hotelId/dashboard/stats`
2. Retourner :
   - Taux d'occupation actuel
   - Revenus du mois en cours
   - Nombre de check-ins aujourd'hui
   - Alertes (stock faible, etc.)

3. Utiliser une seule requête avec agrégations SQL :
```typescript
const stats = await db
  .select({
    occupancyRate: sql<number>`...`,
    monthlyRevenue: sql<number>`...`,
    // ...
  })
  .from(reservations)
  .where(eq(reservations.hotelId, hotelId));
```

**Questions de réflexion :**
- Pourquoi un endpoint dédié plutôt que plusieurs requêtes séparées ?
- Comment calculer le taux d'occupation précisément ?

---

## ⚛️ Module 4 : Frontend React

### Exercice 4.1 : Formulaire de création de chambre avec validation

**Objectif :** Maîtriser React Hook Form + Zod.

**Instructions :**
1. Créer composant `RoomForm.tsx`
2. Champs :
   - Room Number (requis, unique par hôtel)
   - Type (select : Single, Double, Suite)
   - Price per Night (nombre, > 0)
   - Capacity (nombre entier, 1-10)
   - Status (select, default: available)
   - Notes (textarea, optionnel)

3. Validation Zod :
```typescript
const roomFormSchema = insertRoomSchema.extend({
  roomNumber: z.string()
    .min(1, "Room number is required")
    .max(20, "Room number too long"),
  pricePerNight: z.string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  capacity: z.number().min(1).max(10),
});
```

4. Utiliser shadcn/ui Form components

**Validation :**
- Tester tous les cas d'erreur
- Vérifier que le formulaire se réinitialise après succès
- Gérer le loading state pendant la soumission

---

### Exercice 4.2 : Liste de réservations avec filtres et tri

**Objectif :** Gérer des données complexes avec TanStack Query.

**Instructions :**
1. Page `Reservations.tsx` avec :
   - Filtres : Status, Date range
   - Tri : Par date, par client, par montant
   - Pagination

2. Utiliser `useQuery` avec des paramètres dynamiques :
```typescript
const { data, isLoading } = useQuery({
  queryKey: ["reservations", hotelId, filters, sort, page],
  queryFn: () => fetchReservations({ hotelId, filters, sort, page }),
});
```

3. Créer un composant `ReservationFilters` réutilisable

**Améliorations :**
- Debounce sur les champs de recherche (evite trop de requêtes)
- Optimistic updates pour les changements de statut
- Skeleton loading pendant le fetch

---

### Exercice 4.3 : Hook personnalisé pour les appels API

**Objectif :** Réutiliser la logique de fetching.

**Instructions :**
1. Créer `useRooms.ts` :
```typescript
export function useRooms(hotelId: string | null) {
  return useQuery({
    queryKey: ["rooms", hotelId],
    queryFn: () => apiRequest<Room[]>(`/hotels/${hotelId}/rooms`),
    enabled: !!hotelId,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  const { hotel } = useAuth();
  
  return useMutation({
    mutationFn: (data: InsertRoom) => 
      apiRequest(`/hotels/${hotel?.id}/rooms`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", hotel?.id] });
    },
  });
}
```

2. Utiliser dans les composants :
```typescript
const { data: rooms, isLoading } = useRooms(hotel?.id);
const createRoom = useCreateRoom();
```

**Avantages :**
- Code plus lisible
- Réutilisable partout
- Centralisation de la logique

---

## 🎨 Module 5 : UI/UX

### Exercice 5.1 : Composant DateRangePicker réutilisable

**Objectif :** Créer un composant date range avec validation.

**Instructions :**
1. Utiliser `react-day-picker` ou `date-fns`
2. Props :
   - `value: { start: Date | null, end: Date | null }`
   - `onChange: (range) => void`
   - `minDate?: Date` (pour éviter les dates passées)
   - `disabledDates?: Date[]` (dates déjà réservées)

3. Afficher un calendrier avec :
   - Sélection de plage
   - Dates désactivées visuellement
   - Tooltips sur les dates désactivées

**Code de départ :**
```typescript
import { DateRange } from "react-day-picker";

export function DateRangePicker({ value, onChange, ... }: Props) {
  // TODO: Implémenter
}
```

---

### Exercice 5.2 : Tableau avec tri et pagination

**Objectif :** Créer un composant Table réutilisable.

**Instructions :**
1. Composant `DataTable<T>` générique
2. Props :
   - `data: T[]`
   - `columns: ColumnDef<T>[]`
   - `sortable?: boolean`
   - `onSort?: (column: string, direction: "asc" | "desc") => void`

3. Utiliser shadcn/ui Table + tri client-side ou server-side

**Exemple d'utilisation :**
```typescript
<DataTable
  data={reservations}
  columns={[
    { key: "guest.name", label: "Guest", sortable: true },
    { key: "checkIn", label: "Check-in", sortable: true },
    { key: "status", label: "Status" },
  ]}
  onSort={(col, dir) => setSort({ col, dir })}
/>
```

---

## 🔄 Module 6 : Intégration Front-Back

### Exercice 6.1 : Synchronisation optimiste pour changement de statut

**Objectif :** Améliorer l'UX avec optimistic updates.

**Instructions :**
1. Hook `useUpdateReservationStatus` :
```typescript
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) =>
      apiRequest(`/reservations/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    
    onMutate: async ({ id, status }) => {
      // 1. Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: ["reservations"] });
      
      // 2. Snapshot
      const previous = queryClient.getQueryData(["reservations"]);
      
      // 3. Optimistic update
      queryClient.setQueryData(["reservations"], (old: Reservation[]) =>
        old.map(r => r.id === id ? { ...r, status } : r)
      );
      
      return { previous };
    },
    
    onError: (err, vars, context) => {
      // Rollback
      queryClient.setQueryData(["reservations"], context.previous);
      toast.error("Failed to update status");
    },
    
    onSuccess: () => {
      // Refetch pour cohérence
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
}
```

2. Utiliser dans un composant avec boutons rapides :
```typescript
const updateStatus = useUpdateReservationStatus();

<Button onClick={() => updateStatus.mutate({ id, status: "confirmed" })}>
  Confirm
</Button>
```

---

### Exercice 6.2 : Gestion d'erreurs centralisée avec retry

**Objectif :** Gérer les erreurs réseau gracieusement.

**Instructions :**
1. Créer un intercepteur d'erreurs :
```typescript
export async function apiRequest<T>(...): Promise<T> {
  try {
    const response = await fetch(...);
    
    if (!response.ok) {
      // Gestion des codes HTTP spécifiques
      if (response.status === 401) {
        // Token expiré → refresh ou logout
        handleAuthError();
      }
      
      throw new APIError(response.status, await response.json());
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof NetworkError) {
      // Retry logic
      return retry(() => apiRequest(...), { maxRetries: 3 });
    }
    throw error;
  }
}
```

2. Configurer TanStack Query pour retry automatique :
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 3 tentatives
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

---

## 🧪 Module 7 : Tests

### Exercice 7.1 : Tests unitaires pour la logique de calcul

**Objectif :** Tester les fonctions de calcul de prix.

**Instructions :**
1. Créer `utils/calculations.test.ts`
2. Fonction à tester :
```typescript
export function calculateTotalPrice(
  pricePerNight: number,
  checkIn: Date,
  checkOut: Date
): number {
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  );
  return pricePerNight * nights;
}
```

3. Tests :
```typescript
describe("calculateTotalPrice", () => {
  it("should calculate for 1 night", () => {
    const result = calculateTotalPrice(
      100,
      new Date("2024-01-01"),
      new Date("2024-01-02")
    );
    expect(result).toBe(100);
  });

  it("should calculate for multiple nights", () => {
    // TODO: Test pour 5 nuits
  });

  it("should handle partial days as full night", () => {
    // Ex: 01/01 14:00 → 02/01 10:00 = 1 nuit (pas 0.8)
  });
});
```

---

### Exercice 7.2 : Tests d'intégration pour les routes API

**Objectif :** Tester les routes complètes.

**Instructions :**
1. Setup de test avec base de données de test
2. Test de création de réservation :
```typescript
describe("POST /api/hotels/:hotelId/reservations", () => {
  it("should create a reservation", async () => {
    const response = await request(app)
      .post("/api/hotels/test-hotel/reservations")
      .set("Authorization", `Bearer ${token}`)
      .send({
        roomId: "room-1",
        guestId: "guest-1",
        checkIn: "2024-01-15",
        checkOut: "2024-01-17",
      })
      .expect(201);

    expect(response.body).toHaveProperty("id");
  });

  it("should reject double booking", async () => {
    // Créer une première réservation
    // Essayer de créer une seconde conflictuelle
    // Vérifier erreur 400
  });
});
```

3. Utiliser des fixtures (données de test réutilisables)

---

## 🚀 Module 8 : Production et Déploiement

### Exercice 8.1 : Configuration d'environnements

**Objectif :** Gérer dev/staging/prod proprement.

**Instructions :**
1. Créer `.env.example` :
```env
DATABASE_URL=
SESSION_SECRET=
NODE_ENV=development
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

2. Créer `.env.development`, `.env.production`
3. Scripts dans `package.json` :
```json
{
  "scripts": {
    "dev": "dotenv -e .env.development -- tsx server/index.ts",
    "build": "vite build",
    "start": "dotenv -e .env.production -- node dist/index.js"
  }
}
```

4. Valider les variables requises au démarrage :
```typescript
const requiredEnvVars = ["DATABASE_URL", "SESSION_SECRET"];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}
```

---

### Exercice 8.2 : Ajouter le logging structuré

**Objectif :** Logs utiles pour le debugging en production.

**Instructions :**
1. Installer `winston` ou `pino`
2. Créer `server/logger.ts` :
```typescript
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

3. Utiliser dans les routes :
```typescript
logger.info("Reservation created", { 
  reservationId: reservation.id,
  hotelId: hotel.id,
  userId: user.id,
});
```

---

## 🎓 Projets Complets

### Projet Final 1 : Module de facturation

**Objectif :** Créer un système complet de facturation.

**Fonctionnalités :**
1. Génération de factures PDF
2. Envoi par email
3. Historique des factures
4. Recherche et filtres

**Technologies :**
- PDF : `pdfkit` ou `puppeteer`
- Email : `nodemailer` ou service externe (SendGrid)

---

### Projet Final 2 : Tableau de bord analytics avancé

**Objectif :** Visualisations de données avec Recharts.

**Fonctionnalités :**
1. Graphiques de revenus (ligne temporelle)
2. Graphique d'occupation (donut chart)
3. Top produits vendus (bar chart)
4. Comparaison période (mois actuel vs précédent)

---

## 📝 Checklist de Progression

Utilisez cette checklist pour suivre votre progression :

### Niveau Débutant
- [ ] Créer une table avec relations
- [ ] Implémenter une route CRUD complète
- [ ] Créer un composant React avec formulaire
- [ ] Utiliser TanStack Query pour fetch des données

### Niveau Intermédiaire
- [ ] Implémenter l'authentification complète
- [ ] Créer des hooks personnalisés réutilisables
- [ ] Gérer les erreurs et loading states
- [ ] Écrire des tests unitaires

### Niveau Avancé
- [ ] Optimistic updates
- [ ] Pagination et recherche avancée
- [ ] Tests d'intégration complets
- [ ] Configuration de production

---

**Continuez à pratiquer régulièrement ! Chaque exercice vous rapproche de la maîtrise. 🚀**
