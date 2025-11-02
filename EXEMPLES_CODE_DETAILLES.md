# 📝 Exemples de Code Détaillés - Explication Ligne par Ligne

Ce document contient des exemples de code du projet expliqués en détail pour chaque ligne.

---

## 🔐 Exemple 1 : Authentification JWT - Génération et Vérification

### Fichier : `server/auth.ts`

```typescript
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Ligne 1-2 : Import des dépendances
// - jwt : Library pour créer et vérifier les tokens JWT
// - Request, Response, NextFunction : Types Express pour les middleware
```

```typescript
const JWT_SECRET = process.env.SESSION_SECRET || "fallback-secret-key-for-development";

// Explication :
// - process.env.SESSION_SECRET : Variable d'environnement (sécurisée, pas dans le code)
// - || "fallback..." : Valeur par défaut SEULEMENT en développement
// ⚠️ En production : TOUJOURS définir SESSION_SECRET (sinon tous les tokens sont compromis)
// 
// Pourquoi une variable d'environnement ?
// - Ne jamais commit les secrets dans Git
// - Différentes valeurs par environnement (dev, staging, prod)
```

```typescript
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  hotelId: string | null;
}

// Explication :
// Interface TypeScript : Définit la structure des données dans le token
// - userId : Identifiant unique de l'utilisateur
// - email : Pour l'affichage (évite un fetch supplémentaire)
// - role : Pour les vérifications de permissions
// - hotelId : null pour super_admin, sinon ID de l'hôtel (multi-tenant)
//
// Pourquoi dans le token et pas dans la DB à chaque requête ?
// - Performance : Pas besoin de query DB à chaque requête
// - Scalabilité : Token contient toutes les infos nécessaires
```

```typescript
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Explication ligne par ligne :
// 
// 1. export function generateToken(...)
//    - export : Fonction exportée (utilisable dans d'autres fichiers)
//    - function : Déclaration de fonction (alternative : const generateToken = (...))
//    - payload: TokenPayload : Paramètre typé (TypeScript garantit la structure)
//    - : string : Type de retour (le token est une chaîne de caractères)
//
// 2. return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
//    - jwt.sign() : Fonction de la library jsonwebtoken
//      * payload : Données à encoder dans le token (userId, email, etc.)
//      * JWT_SECRET : Clé secrète pour signer (détecte les modifications)
//      * { expiresIn: "7d" } : Token expire dans 7 jours
//        - Pourquoi 7 jours ? Équilibre sécurité/UX
//        - Alternative : Tokens courts (15min) + refresh tokens (meilleure sécurité)
//
// Structure d'un JWT :
// [header].[payload].[signature]
// - header : Type d'algorithme (HS256)
// - payload : Données encodées en base64 (pas crypté ! Ne pas mettre de données sensibles)
// - signature : Hash(header + payload + secret) → Détecte les modifications
```

```typescript
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// Explication ligne par ligne :
//
// 1. verifyToken(token: string)
//    - token : Le JWT à vérifier (chaîne de caractères)
//    - : TokenPayload | null : Retourne soit les données, soit null (si invalide)
//
// 2. try { ... } catch { ... }
//    - try : Bloc qui peut lancer une exception
//    - catch : Bloc exécuté si erreur (token expiré, signature invalide, etc.)
//
// 3. jwt.verify(token, JWT_SECRET)
//    - Vérifie :
//      * La signature (token non modifié)
//      * L'expiration
//      * Le format
//    - Retourne le payload décodé si valide
//    - Lance une exception si invalide
//
// 4. as TokenPayload
//    - Type assertion TypeScript
//    - jwt.verify retourne unknown, on dit à TS que c'est TokenPayload
//    - Alternative : Validation Zod pour être sûr
//
// 5. return null
//    - Si token invalide, retourne null (plutôt que lancer l'erreur)
//    - Permet de gérer gracieusement les tokens invalides
```

```typescript
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }

  (req as any).user = payload;
  next();
}

// Explication ligne par ligne :
//
// 1. export function authenticateToken(req, res, next)
//    - Middleware Express : Fonction qui intercepte les requêtes
//    - req : Objet requête (headers, body, params)
//    - res : Objet réponse (pour envoyer la réponse HTTP)
//    - next : Fonction pour passer au middleware suivant
//
// 2. const authHeader = req.headers.authorization
//    - Récupère le header "Authorization"
//    - Format standard : "Bearer <token>"
//    - Peut être undefined si header absent
//
// 3. const token = authHeader && authHeader.split(" ")[1]
//    - authHeader && ... : Si authHeader existe (truthy), exécute le reste
//    - split(" ") : Découpe la chaîne par espaces
//      * "Bearer abc123" → ["Bearer", "abc123"]
//    - [1] : Prend le deuxième élément (le token)
//    - Si pas de header : token = undefined
//
// 4. if (!token) { return res.status(401)... }
//    - !token : Si token est falsy (undefined, null, "")
//    - 401 Unauthorized : Code HTTP standard pour "pas authentifié"
//    - return : Arrête l'exécution (ne passe pas à next())
//
// 5. const payload = verifyToken(token)
//    - Vérifie et décode le token
//    - Retourne null si invalide
//
// 6. if (!payload) { return res.status(403)... }
//    - 403 Forbidden : Code HTTP pour "authentifié mais pas autorisé"
//    - Différence 401/403 :
//      * 401 : Pas de token ou token invalide
//      * 403 : Token valide mais permissions insuffisantes
//
// 7. (req as any).user = payload
//    - Attache les données utilisateur à la requête
//    - (req as any) : Type assertion (req.user n'existe pas dans les types Express)
//    - Alternative : Extendre les types Express (meilleure pratique)
//    - Accessible dans les routes : req.user
//
// 8. next()
//    - Passe au middleware/route suivant
//    - Si on ne l'appelle pas, la requête reste bloquée
```

### Utilisation dans une route :

```typescript
app.get("/api/hotels/:hotelId/rooms", 
  authenticateToken,  // ← Middleware : vérifie le token avant la route
  async (req, res) => {
    // req.user est disponible ici (userId, email, role, hotelId)
    const user = (req as any).user;
    
    // Vérifier que l'utilisateur accède à SON hôtel
    if (user.hotelId !== req.params.hotelId) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // ...
  }
);
```

---

## 💾 Exemple 2 : Repository Pattern - Couche d'Abstraction des Données

### Fichier : `server/storage.ts`

```typescript
import { eq, and, gte, lte, desc } from "drizzle-orm";

// Explication des fonctions Drizzle :
// - eq(column, value) : WHERE column = value
// - and(...) : WHERE condition1 AND condition2 AND ...
// - gte(column, value) : WHERE column >= value
// - lte(column, value) : WHERE column <= value
// - desc(column) : ORDER BY column DESC
```

```typescript
export interface IStorage {
  getHotel(id: string): Promise<Hotel | undefined>;
  // ...
}

// Explication :
// - Interface TypeScript : Contrat que doit respecter l'implémentation
// - Pourquoi une interface ?
//   * Permet de créer plusieurs implémentations (DB, mock pour tests, etc.)
//   * Définit clairement l'API publique
//   * Facilite le testing (mock de l'interface)
//
// - Promise<Hotel | undefined>
//   * Promise : Toutes les opérations DB sont asynchrones
//   * Hotel | undefined : Peut retourner un hôtel ou undefined (pas trouvé)
//   * Pourquoi undefined et pas null ? Convention TypeScript (null = intentionnel, undefined = absence)
```

```typescript
export class DatabaseStorage implements IStorage {
  // implements IStorage : Garantit que la classe respecte l'interface
  
  async getHotel(id: string): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel || undefined;
  }
  
  // Explication ligne par ligne :
  //
  // 1. async getHotel(...)
  //    - async : Fonction asynchrone (retourne une Promise)
  //    - await : Attend la résolution de la Promise
  //
  // 2. db.select().from(hotels).where(eq(hotels.id, id))
  //    - db.select() : Début d'une requête SELECT
  //    - .from(hotels) : Table source (FROM hotels)
  //    - .where(eq(...)) : Condition WHERE (WHERE id = ?)
  //    - Drizzle génère le SQL : SELECT * FROM hotels WHERE id = $1
  //
  // 3. const [hotel] = await ...
  //    - Destructuring : Prend le premier élément du tableau
  //    - db.select() retourne toujours un tableau (même si 0 ou 1 résultat)
  //    - Si aucun résultat : hotel = undefined
  //
  // 4. return hotel || undefined
  //    - || undefined : Si hotel est null, retourne undefined
  //    - Garantit que le retour est toujours undefined (pas null)
```

```typescript
async getReservationsByRoom(
  roomId: string, 
  startDate: Date, 
  endDate: Date
): Promise<Reservation[]> {
  return await db.select()
    .from(reservations)
    .where(
      and(
        eq(reservations.roomId, roomId),
        gte(reservations.checkOut, startDate),
        lte(reservations.checkIn, endDate)
      )
    );
}

// Explication ligne par ligne :
//
// 1. async getReservationsByRoom(roomId, startDate, endDate)
//    - roomId : Chambre à vérifier
//    - startDate : Début de la période
//    - endDate : Fin de la période
//    - Retourne : Toutes les réservations qui se chevauchent
//
// 2. db.select().from(reservations)
//    - SELECT * FROM reservations
//
// 3. .where(and(...))
//    - WHERE condition1 AND condition2 AND condition3
//
// 4. eq(reservations.roomId, roomId)
//    - WHERE room_id = ?
//    - Filtre les réservations de cette chambre
//
// 5. gte(reservations.checkOut, startDate)
//    - WHERE check_out >= ?
//    - Réservation se termine après le début de la période
//
// 6. lte(reservations.checkIn, endDate)
//    - WHERE check_in <= ?
//    - Réservation commence avant la fin de la période
//
// Logique de chevauchement :
// Deux périodes se chevauchent si :
// - check_out >= startDate ET check_in <= endDate
//
// Exemple :
// Réservation existante : 15/01 - 20/01
// Nouvelle réservation : 18/01 - 22/01
// → Chevauchement détecté (check_out=20 >= startDate=18 ET check_in=15 <= endDate=22)
```

```typescript
async createReservation(insertReservation: InsertReservation): Promise<Reservation> {
  const [reservation] = await db.insert(reservations)
    .values(insertReservation)
    .returning();
  return reservation;
}

// Explication ligne par ligne :
//
// 1. db.insert(reservations)
//    - INSERT INTO reservations
//
// 2. .values(insertReservation)
//    - VALUES (?, ?, ?, ...)
//    - insertReservation : Objet avec les valeurs (validé par Zod avant)
//
// 3. .returning()
//    - PostgreSQL spécifique : Retourne les lignes insérées
//    - Alternative : Faire un SELECT après l'INSERT (2 requêtes au lieu d'1)
//    - Retourne un tableau avec les lignes créées
//
// 4. const [reservation] = ...
//    - Destructuring : Prend le premier élément (on insère qu'une ligne)
//
// 5. return reservation
//    - Retourne la réservation créée (avec l'ID généré par la DB)
```

```typescript
async updateRoom(id: string, updateData: Partial<InsertRoom>): Promise<Room> {
  const [room] = await db.update(rooms)
    .set(updateData)
    .where(eq(rooms.id, id))
    .returning();
  return room;
}

// Explication ligne par ligne :
//
// 1. db.update(rooms)
//    - UPDATE rooms
//
// 2. .set(updateData)
//    - SET column1 = ?, column2 = ?, ...
//    - updateData : Objet avec seulement les champs à mettre à jour
//    - Partial<InsertRoom> : Tous les champs sont optionnels
//
// 3. .where(eq(rooms.id, id))
//    - WHERE id = ?
//    - Identifie la ligne à mettre à jour
//
// 4. .returning()
//    - Retourne la ligne mise à jour
//    - Utile pour avoir les valeurs calculées (updated_at, etc.)
//
// Exemple d'utilisation :
// await storage.updateRoom("room-123", { status: "occupied" })
// → UPDATE rooms SET status = 'occupied' WHERE id = 'room-123'
```

---

## 🌐 Exemple 3 : Route API REST avec Validation

### Fichier : `server/routes.ts`

```typescript
app.post("/api/hotels/:hotelId/reservations", async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    
    // Explication :
    // - req.body : Données JSON envoyées par le client
    // - Destructuring : Extrait roomId, checkIn, checkOut
    // - Pas encore validé ! Doit être validé avec Zod
```

```typescript
    // Vérification de double réservation
    const existingReservations = await storage.getReservationsByRoom(
      roomId,
      new Date(checkIn),
      new Date(checkOut)
    );
    
    // Explication :
    // - new Date(checkIn) : Convertit la chaîne en objet Date
    //   * Le client envoie "2024-01-15" (string ISO)
    //   * PostgreSQL attend un timestamp
    // - getReservationsByRoom : Retourne les réservations qui se chevauchent
```

```typescript
    const hasConflict = existingReservations.some(r => 
      r.status !== "cancelled" && r.status !== "checked_out"
    );
    
    // Explication ligne par ligne :
    //
    // 1. existingReservations.some(...)
    //    - some() : Retourne true si AU MOINS un élément satisfait la condition
    //    - Alternative : every() (tous), filter() (tous les éléments)
    //
    // 2. r => r.status !== "cancelled" && r.status !== "checked_out"
    //    - Fonction arrow (ES6)
    //    - Pour chaque réservation r
    //    - Vérifie si le statut n'est PAS cancelled ET n'est PAS checked_out
    //    - Pourquoi ? Une chambre cancelled/checked_out est disponible
    //
    // 3. hasConflict : true si conflit, false sinon
```

```typescript
    if (hasConflict) {
      return res.status(400).json({ 
        message: "Room is already booked for these dates" 
      });
    }
    
    // Explication :
    // - 400 Bad Request : Erreur côté client (données invalides)
    // - return : Arrête l'exécution (ne continue pas)
    // - Format d'erreur cohérent : { message: "..." }
```

```typescript
    const validated = insertReservationSchema.parse({
      ...req.body,
      hotelId: req.params.hotelId,
    });
    
    // Explication ligne par ligne :
    //
    // 1. insertReservationSchema.parse(...)
    //    - Zod : Validation des données
    //    - parse() : Valide et retourne les données si OK
    //    - Lance ZodError si invalide (catch dans le try/catch)
    //
    // 2. { ...req.body, hotelId: req.params.hotelId }
    //    - Spread operator (...req.body) : Copie toutes les propriétés
    //    - hotelId: req.params.hotelId : Ajoute/remplace hotelId depuis l'URL
    //    - Pourquoi ? Le client ne doit PAS envoyer hotelId (sécurité)
    //      * L'hôtel est déterminé par l'URL (ou depuis req.user.hotelId)
    //
    // 3. const validated
    //    - Type TypeScript : InsertReservation (garanti par Zod)
    //    - Type-safe : TypeScript sait que validated a la bonne structure
```

```typescript
    const reservation = await storage.createReservation(validated);
    res.status(201).json(reservation);
    
    // Explication :
    // - await : Attend la création en DB
    // - 201 Created : Code HTTP pour création réussie
    // - .json(reservation) : Envoie la réservation créée au client
    //   * Content-Type: application/json automatique
```

```typescript
  } catch (error) {
    handleValidationError(error, res);
  }
});

// Explication :
// - catch : Capture toutes les erreurs dans le try
// - handleValidationError : Fonction centralisée pour gérer les erreurs
//   * ZodError → 400 avec détails
//   * Autres erreurs → 500 avec message générique
```

---

## ⚛️ Exemple 4 : Hook React avec TanStack Query

### Fichier : `client/src/pages/rooms.tsx`

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Explication des hooks TanStack Query :
// - useQuery : Pour GET (fetch + cache)
// - useMutation : Pour POST/PATCH/DELETE (mutations)
// - useQueryClient : Accès au client pour invalider le cache
```

```typescript
export default function Rooms() {
  const { hotel } = useAuth();
  const queryClient = useQueryClient();
  
  // Explication :
  // - useAuth() : Hook Zustand (état global)
  // - hotel : Hôtel de l'utilisateur connecté (ou null)
  // - queryClient : Instance TanStack Query pour gérer le cache
```

```typescript
  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ["rooms", hotel?.id],
    queryFn: () => apiRequest<Room[]>(`/hotels/${hotel?.id}/rooms`),
    enabled: !!hotel?.id,
  });
  
  // Explication ligne par ligne :
  //
  // 1. useQuery({ ... })
  //    - Hook React : Fetch + cache automatique
  //    - Retourne : { data, isLoading, error, refetch, ... }
  //
  // 2. queryKey: ["rooms", hotel?.id]
  //    - Clé unique du cache
  //    - Format : [nom, ...dépendances]
  //    - Dépendances : hotel?.id (si change, refetch automatique)
  //    - Utilisé pour : invalidation, mise à jour manuelle
  //
  // 3. queryFn: () => apiRequest<Room[]>(...)
  //    - Fonction qui fetch les données
  //    - Exécutée automatiquement au montage du composant
  //    - Type générique <Room[]> : TypeScript sait que data est Room[]
  //
  // 4. enabled: !!hotel?.id
  //    - !! : Double négation (convertit en boolean)
  //    - hotel?.id : Optional chaining (undefined si hotel est null)
  //    - enabled: false → Ne fetch PAS (attend que hotel.id existe)
  //    - Pourquoi ? Évite une requête inutile si pas d'hôtel
```

```typescript
  const createRoom = useMutation({
    mutationFn: (data: InsertRoom) => 
      apiRequest<Room>(`/hotels/${hotel?.id}/rooms`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    
    // Explication :
    // - mutationFn : Fonction qui fait la mutation
    // - Paramètre : data (InsertRoom, typé par TypeScript)
    // - Retourne : Promise<Room>
```

```typescript
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms", hotel?.id] });
    },
    
    // Explication ligne par ligne :
    //
    // 1. onSuccess: () => { ... }
    //    - Callback exécuté après succès de la mutation
    //    - Autres callbacks : onError, onMutate (optimistic update)
    //
    // 2. queryClient.invalidateQueries({ queryKey: ["rooms", hotel?.id] })
    //    - Invalide le cache pour cette queryKey
    //    - TanStack Query va automatiquement refetch
    //    - Pourquoi ? Les données ont changé, le cache est obsolète
    //    - Alternative : setQueryData (mise à jour manuelle du cache)
```

```typescript
  const handleSubmit = (data: InsertRoom) => {
    createRoom.mutate(data, {
      onSuccess: () => {
        toast.success("Room created successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create room");
      },
    });
  };
  
  // Explication ligne par ligne :
  //
  // 1. createRoom.mutate(data, { ... })
  //    - Déclenche la mutation
  //    - data : Données à envoyer
  //    - { onSuccess, onError } : Callbacks spécifiques à cet appel
  //
  // 2. onSuccess : Affiche un toast de succès
  // 3. onError : Affiche un toast d'erreur
  //
  // Note : Les callbacks dans mutate() s'exécutent APRÈS ceux de useMutation()
```

```typescript
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!rooms) return null;
  
  // Explication :
  // - Early returns : Sort tôt si conditions non remplies
  // - Meilleure lisibilité que des ternaires imbriqués
  // - isLoading : Pendant le fetch initial
  // - error : Si la requête échoue
  // - !rooms : Si pas encore de données (devrait pas arriver, mais TypeScript)
```

```typescript
  return (
    <div>
      {rooms.map(room => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
}

// Explication :
// - rooms.map() : Transforme chaque room en composant RoomCard
// - key={room.id} : Requis par React (performance + stabilité)
//   * React utilise key pour identifier les éléments
//   * Si key change, React recrée le composant (pas juste mettre à jour)
```

---

## 🎨 Exemple 5 : Composant React avec Form Validation

### Fichier : `client/src/components/RoomForm.tsx`

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRoomSchema } from "@shared/schema";

// Explication :
// - useForm : Hook React Hook Form (gestion de formulaires)
// - zodResolver : Bridge entre React Hook Form et Zod
//   * Valide avec Zod, gestion d'erreurs avec RHF
```

```typescript
export function RoomForm({ hotelId, onSubmit }: Props) {
  const form = useForm<InsertRoom>({
    resolver: zodResolver(insertRoomSchema),
    defaultValues: {
      hotelId,
      status: "available",
    },
  });
  
  // Explication ligne par ligne :
  //
  // 1. useForm<InsertRoom>({ ... })
  //    - Type générique : TypeScript connaît la structure du formulaire
  //    - Retourne : form object avec méthodes (register, handleSubmit, etc.)
  //
  // 2. resolver: zodResolver(insertRoomSchema)
  //    - Utilise Zod pour la validation
  //    - Valide automatiquement à la soumission
  //    - Valide aussi en temps réel (si configuré)
  //
  // 3. defaultValues
  //    - Valeurs par défaut du formulaire
  //    - hotelId : Prérempli (pas d'input pour l'utilisateur)
  //    - status : Par défaut "available"
```

```typescript
  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
    form.reset(); // Réinitialise le formulaire après succès
  });
  
  // Explication ligne par ligne :
  //
  // 1. form.handleSubmit(async (data) => { ... })
  //    - handleSubmit : Wrapper qui valide avant d'exécuter
  //    - Si validation échoue : Ne passe pas dans la fonction
  //    - data : Données validées (InsertRoom, garanti par Zod)
  //
  // 2. await onSubmit(data)
  //    - Appel de la fonction parent (prop)
  //    - await : Attend la completion (pour le reset après)
  //
  // 3. form.reset()
  //    - Réinitialise le formulaire aux defaultValues
  //    - Utile après création réussie
```

```typescript
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Room Number</label>
        <input
          {...form.register("roomNumber")}
          className={form.formState.errors.roomNumber ? "error" : ""}
        />
        {form.formState.errors.roomNumber && (
          <span>{form.formState.errors.roomNumber.message}</span>
        )}
      </div>
      
      {/* Explication ligne par ligne :
      //
      // 1. <form onSubmit={handleSubmit}>
      //    - onSubmit : Déclenché quand formulaire soumis (Enter ou bouton)
      //
      // 2. {...form.register("roomNumber")}
      //    - Spread operator : Déplie les props
      //    - register() retourne : { name, onChange, onBlur, ref }
      //    - Connecte l'input au state de React Hook Form
      //
      // 3. form.formState.errors.roomNumber
      //    - Erreurs de validation pour ce champ
      //    - Défini par Zod (si roomNumber invalide)
      //
      // 4. {form.formState.errors.roomNumber && (...)}
      //    - Rendu conditionnel : Affiche l'erreur si présente
      //    - && : Si vrai, affiche le span, sinon rien
      */}
      
      <button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Creating..." : "Create Room"}
      </button>
    </form>
  );
}
```

**Amélioration avec shadcn/ui :**

```typescript
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Utilisation avec composants shadcn/ui (plus accessible)
<Form {...form}>
  <FormField
    control={form.control}
    name="roomNumber"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Room Number</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage /> {/* Affiche automatiquement l'erreur */}
      </FormItem>
    )}
  />
</Form>
```

---

## 🔄 Exemple 6 : Optimistic Updates avec TanStack Query

```typescript
const updateRoom = useMutation({
  mutationFn: (data: UpdateRoom) => 
    api.patch(`/rooms/${data.id}`, data),
  
  // Explication : Optimistic update
  // - On met à jour le cache AVANT la réponse serveur
  // - Améliore la perception de performance (UX)
  // - Si erreur : Rollback automatique
  
  onMutate: async (newRoom) => {
    // 1. Annule les requêtes en cours pour éviter les conflits
    await queryClient.cancelQueries({ queryKey: ["rooms"] });
    
    // 2. Snapshot de l'état précédent (pour rollback si erreur)
    const previousRooms = queryClient.getQueryData<Room[]>(["rooms"]);
    
    // 3. Mise à jour optimiste du cache
    queryClient.setQueryData<Room[]>(["rooms"], (old) =>
      old?.map(room => 
        room.id === newRoom.id 
          ? { ...room, ...newRoom }  // Merge les nouvelles données
          : room
      )
    );
    
    // 4. Retourne le contexte (pour onError)
    return { previousRooms };
  },
  
  onError: (err, newRoom, context) => {
    // En cas d'erreur : Rollback au snapshot
    if (context?.previousRooms) {
      queryClient.setQueryData(["rooms"], context.previousRooms);
    }
    toast.error("Failed to update room");
  },
  
  onSuccess: () => {
    // Succès : Invalide pour refetch (données fraîches du serveur)
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  },
});
```

**Explication détaillée :**

1. **onMutate** (avant la requête)
   - `cancelQueries` : Annule les requêtes en cours (évite les conflits)
   - `getQueryData` : Snapshot pour rollback
   - `setQueryData` : Mise à jour optimiste (affichage immédiat)

2. **onError** (si la requête échoue)
   - Rollback au snapshot précédent
   - L'utilisateur voit que ça n'a pas marché

3. **onSuccess** (après succès)
   - Invalidation pour avoir les données fraîches du serveur
   - Garantit la cohérence (le serveur peut avoir fait des calculs)

**Avantages :**
- ✅ UX meilleure (pas d'attente)
- ✅ Gestion d'erreur automatique (rollback)
- ✅ Cohérence finale (refetch après succès)

---

## 📝 Exercices Pratiques

### Exercice 1 : Créer une route de recherche de clients

**Objectif :** Implémenter `GET /api/hotels/:hotelId/guests/search?q=john`

**Étapes :**
1. Ajouter la méthode dans `IStorage` et `DatabaseStorage`
2. Utiliser `like()` de Drizzle pour recherche partielle
3. Créer la route avec validation du paramètre `q`
4. Tester avec différents termes de recherche

### Exercice 2 : Système de permissions

**Objectif :** Limiter l'accès selon le rôle

**Étapes :**
1. Créer un middleware `requireRole("owner", "receptionist")`
2. L'utiliser sur les routes sensibles
3. Vérifier aussi que `hotelId` correspond (éviter l'accès croisé)

### Exercice 3 : Pagination des réservations

**Objectif :** Limiter les résultats retournés

**Étapes :**
1. Ajouter `limit` et `offset` dans la méthode storage
2. Retourner aussi le `total` (nombre total de résultats)
3. Créer un hook React `usePaginatedReservations`

---

**Continuez à pratiquer avec ces exemples ! Chaque ligne de code a une raison d'être. 🚀**
