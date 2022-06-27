class Pairing {
    constructor(x, y) {
        this.X = x;
        this.Y = y;
    }
}
class ConstrainFurnisher {


    constructor(m) {
        this.Map = m;
    }


    Init() {
        rng = new Random();
        this.PotionPairings = [];
        this.TreasurePairings = [];

        this.MinitaurCount = 0;
        this.MeleeMonsterCount = 0;
        this.RangedMonsterCount = 0;
        this.OgreCount = 0;
        this.BlobCount = 0;

        this.TreasureCount = 0;
        this.PotionCount = 0;
        this.TrapCount = 0;

        this.MeleeMonsterMax = Math.floor(Math.random() * 2) + 2;
        this.RangedMonsterMax = Math.floor(Math.random() * 2) + 1;
        this.MinitaurMax = Math.floor(Math.random() * 1) + 1;
        this.BlobMax = 3;
        this.OgreMax = 2;

        this.TreasureMax = Math.floor(Math.random() * 4) + 2;
        this.PotionMax = Math.floor(Math.random() * 4) + 4;
        this.TrapMax = 2;
    }
    GenerateMap() {
        Init();

        //Console.WriteLine("");
        //PrintMap();
        //Console.WriteLine("");

        FindPathToExit();
        PlaceEntrance();
        PlaceExit();

        //PrintMap();
        //Console.WriteLine("");

        PlaceTreasures();
        PlaceOgre();
        PlaceMelee();
        PlaceRanged();

        //PrintMap();
        //Console.WriteLine("");

        PlaceTrap();
        PlacePotions();
        PlaceBlobs();
        PlaceMinitaur();
        PlacePortals();

        //PrintMap();
        //Console.WriteLine("");
    }

    GenerateMap(map) {
        Init();
        Map = map;

        //Console.WriteLine("");
        //      PrintMap();
        //Console.WriteLine("");

        FindPathToExit();
        PlaceEntrance();
        PlaceExit();

        //PrintMap();
        //Console.WriteLine("");

        PlaceTreasures();

        PlaceOgre();
        PlaceMelee();
        PlaceRanged();

        //PrintMap();
        //Console.WriteLine("");

        PlaceTrap();
        PlacePotions();
        PlaceBlobs();
        PlaceMinitaur();
        PlacePortals();

        //PrintMap();
        //Console.WriteLine("");
    }

    // Puts the map in string format.
    MapToString() {
        var mapString = "";

        for (let i = 0; i < this.Map.length; i++) {
            for (let j = 0; j < this.Map[i].length; j++) {
                mapString += this.Map[i][j];
            }
            mapString += "\n";
        }
        return mapString;
    }



    // Places the treasures. 
    // HEURISTIC: Treasures like to be in places with 3 walls
    PlaceTreasures() {
        // lists for x and y coordinates Pairings
        let XY = [];
        let Backup = [];
        // look around the map for dead-ends and place treasures there
        for (let i = 1; i < this.Map.Length - 1; i++) {
            for (let j = 1; j < this.Map[i].Length - 1; j++) {
                let count = 0;
                // check if space is empty
                if (this.Map[i][j] == " ") {
                    // check if at least 3 neighbors are walls
                    if (this.Map[i - 1][j] == "X") {
                        count++;
                    }
                    if (this.Map[i + 1][j] == "X") {
                        count++;
                    }
                    if (this.Map[i][j - 1] == "X") {
                        count++;
                    }
                    if (this.Map[i][j + 1] == "X") {
                        count++;
                    }
                }
                if (count > 2) {
                    // since the spot has >3 walls, mark as a potential treasure spot

                    XY.Add(new Pairing(j, i));
                }
                // add to backuplist
                else if (count > 1) {
                    Backup.Add(new Pairing(j, i));
                }
            }
        }

        // make sure we had >1 potential spot for treasure
        if (XY.Count > 0) {
            for (let i = 0; i < XY.Count; i++) {
                // make sure we are under the treasure threashold and we still have potential spots
                if (this.TreasureCount < this.TreasureMax && XY.Count > 0) {
                    // pick a random spot
                    let index = Math.floor(Math.random() * XY.Count);
                    this.Map[XY[index].Y][XY[index].X] = "T";
                    this.TreasureCount++;
                    this.TreasurePairings.Add(XY[index]);
                }
            }
        }
        // if we exhausted all 3 wall treasure spots, do some 2 wall ones
        if (this.TreasureCount < this.TreasureMax) {
            foreach(point in Backup)
            {
                XY.Add(point);
            }
        }
        // make sure we had >1 potential spot for treasure
        if (XY.Count > 0) {
            for (let i = 0; i < XY.Count; i++) {
                // make sure we are under the treasure threashold and we still have potential spots
                if (this.TreasureCount < this.TreasureMax && XY.Count > 0) {
                    // pick a random spot
                    let index = rng.Next(0, XY.Count);
                    this.Map[XY[index].Y][XY[index].X] = "T";
                    this.TreasureCount++;
                    this.TreasurePairings.Add(XY[index]);
                }
            }
        }
    }

    // Places the potions
    // HEURISTIC: Potions don't care where they live, they will scatter themselves across the map
    PlacePotions() {
        // lists for x and y coordinates, mapped by index
        let XY = [];


        // get all the points that are blank
        for (let i = 0; i < this.Map.length; i++) {
            for (let j = 0; j < this.Map[i].length; j++) {
                if (this.Map[i][j] == " ") {
                    XY.Add(new Pairing(j, i));
                }
            }
        }

        if (XY.Count > 0) {
            for (let i = 0; i < this.PotionMax && XY.Count > 0; i++) {
                let index = rng.Next(0, XY.Count);
                this.Map[XY[index].Y][XY[index].X] = "P";
                this.PotionCount++;
                this.PotionPairings.Add(new Pairing(XY[index].X, XY[index].Y));
                XY.RemoveAt(index);
            }
        }

    }

    // Places the portals.
    // HEURISTIC: Portals like to be somewhere around the entrance and exit (5 to 10 tiles)
    // but they also have to be a minimal distance of 10 tiles away to make any sense
    PlacePortals() {
        let XY = [];
        let entrancePortal = null;
        for (let i = 1; i < this.Map.Length - 1; i++) {
            for (let j = 1; j < this.Map[i].Length - 1; j++) {
                if (this.Map[i][j] == " ") {
                    // make it between 5 to 15 tiles from the entrance
                    let point = new Pairing(j, i);
                    let distance = DistanceBetween(point, this.EntrancePoint);
                    if (distance > 5 && distance < 10) {
                        XY.Add(point);
                    }
                }
            }
        }

        // place the first portal
        if (XY.Count > 1) {
            let index = rng.Next(0, XY.Count);
            this.Map[XY[index].Y][XY[index].X] = "p";
            entrancePortal = XY[index];
            XY.RemoveAt(index);
        }
        XY.Clear();
        // do again for second portal, this time towards the exit, if the first portal was placed
        if (entrancePortal != null) {
            for (let i = 1; i < this.Map.Length - 1; i++) {
                for (let j = 1; j < this.Map[i].Length - 1; j++) {
                    if (this.Map[i][j].Equals(" ")) {
                        // make sure this is 5 - 10 tiles from the exit and 10 tiles from the other portal
                        let point = new Pairing(j, i);
                        let distanceExit = DistanceBetween(point, ExitPoint);
                        let distancePortal = DistanceBetween(point, entrancePortal);
                        if (distanceExit > 5 && distanceExit < 10 && distancePortal > 10) {
                            XY.Add(point);
                        }
                    }
                }
            }
            // place the first portal
            if (XY.Count > 1) {
                let index = Math.floor(Math.random() * XY.Count);
                this.Map[XY[index].Y][XY[index].X] = "p";
                XY.RemoveAt(index);
            }
            // if there is no place for the second portal, remove the first portal
            else {
                this.Map[entrancePortal.Y][entrancePortal.X] = " ";
            }
        }
    }

    // Places the melee monsters.
    // HEURISTIC: Melee monsters like to be with their back to a wall,
    // AND not around each other (within 3 tiles)
    PlaceMelee() {
        // lists for x and y coordinates, mapped by index
        let XY = [];
        // look around the map for walled places. These are the potential initial spots for melee monsters
        for (let i = 1; i < this.Map.length - 1; i++) {
            for (let j = 1; j < this.Map[i].length - 1; j++) {

                let walled = false;
                // check if space is empty
                if (this.Map[i][j] == " ") {
                    // check if one neighbor is a wall
                    if (this.Map[i - 1][j] == "X" || this.Map[i + 1][j] == "X"
                        || this.Map[i][j - 1] == "X" || this.Map[i][j + 1] == "X") {
                        walled = true;
                    }

                }
                if (walled && this.Map[i][j] == " ") {
                    // since the spot has a wall and no monsters around
                    // mark as a potential monster spot
                    XY.Add(new Pairing(j, i));
                }
            }
        }

        // make sure we had >1 potential spot for monsters
        if (XY.Count > 0) {
            for (let i = 0; i < this.MeleeMonsterMax && XY.Count > 0; i++) {
                // loop through the mapping and make sure any places that have melee monsters around it are removed
                let removeUs = [];
                for (let k = 0; k < XY.Count; k++) {

                    if (this.Map[XY[k].Y - 1][XY[k].X] == "M" || this.Map[XY[k].Y + 1][XY[k].X] == "M"
                        || this.Map[XY[k].Y][XY[k].X - 1] == "M" || this.Map[XY[k].Y][XY[k].X + 1] == "M") {
                        // put this in the list to remove from the mapping, since it has monsters around
                        removeUs.Add(k);
                    }
                }
                for (let k = removeUs.Count - 1; k > 0; k--) {
                    XY.RemoveAt(removeUs[k]);
                }
                // pick a random spot
                let rand = Math.floor(Math.random() * XY.Count);
                this.Map[XY[rand].Y][XY[rand].X] = "M";
                MeleeMonsterCount++;
                XY.RemoveAt(rand);
            }
        }
    }


    // Places the ranged.
    // HEURISTIC: Ranged monsters like to be around a melee monster for protection,
    PlaceRanged() {
        // lists for x and y coordinates, mapped by index
        let XY = [];
        // look around the map for places near melee monsters
        for (let i = 1; i < this.Map.length - 1; i++) {
            for (let j = 1; j < this.Map[i].length - 1; j++) {
                let clear = false;
                // check if space is empty
                if (this.Map[i][j].Equals(" ")) {
                    // check that there is a melee monster around
                    if (this.Map[i - 1][j] == "M" || this.Map[i + 1][j] == "M"
                        || this.Map[i][j - 1] == "M" || this.Map[i][j + 1] == "M") {
                        clear = true;
                    }
                }
                if (clear) {
                    // since the spot has a wall and no monsters around
                    // mark as a potential monster spot
                    XY.Add(new Pairing(j, i));
                }
            }
        }

        // make sure we had >1 potential spot for treasure
        if (XY.Count > 0) {
            for (let i = 0; i < this.RangedMonsterMax && XY.Count > 0; i++) {
                // pick a random spot
                let rand = Math.floor(Math.random() * XY.Count);
                this.Map[XY[rand].Y][XY[rand].X] = "R";
                this.RangedMonsterCount++;
                XY.RemoveAt(rand);
            }
        }
    }

    // Places the blobs.
    // HEURISTIC: Blops like to be within 8 tiles of potions, but not nearer than 4 tiles
    PlaceBlobs() {
        // lists for x and y coordinates, mapped by index
        let XY = [];


        foreach(potion in PotionPairings)
        {
            for (let i = 0; i < this.Map.Length; i++) {
                for (let j = 0; j < this.Map[i].Length; j++) {
                    if (this.Map[i][j].Equals(" ")) {
                        let point = new Pairing(j, i);
                        let canSee = this.LineOfSight(point, potion);
                        let distance = this.DistanceBetween(point, potion);
                        if (distance > 4 && distance < 8 && canSee) {
                            XY.Add(point);
                        }
                    }
                }
            }
        }
        // one last loop through XY to make sure all points in there follow the "too close" rule for all potions
        let removeUs = [];
        foreach(potion in PotionPairings)
        {
            foreach(point in XY)
            {
                let distance = this.DistanceBetween(point, potion);
                if (distance < 4) {
                    removeUs.Add(point);
                }
            }
        }

        foreach(rem in removeUs)
        {
            XY.Remove(rem);
        }
        if (XY.Count > 0) {
            for (let m = 0; m < BlobMax && XY.Count > 0; m++) {
                let index = rng.Next(XY.Count);
                this.Map[XY[index].Y][XY[index].X] = "b";
                this.BlobCount++;
                XY.RemoveAt(index);
            }
        }
    }

    /// <summary>
    /// Places the ogres.
    /// HEURISTIC: Ogres like being within eyesight of treasure within 8 tiles, but at least 4 tiles away
    /// but they don't want to see each other at all within 8 tiles
    /// </summary>
    PlaceOgre() {
        let XY = [];
        foreach(treasure in TreasurePairings)
        {
            for (let i = 0; i < this.Map.Length; i++) {
                for (let j = 0; j < this.Map[i].Length; j++) {
                    if (this.Map[i][j] == " ") {
                        let point = new Pairing(j, i);
                        let distance = DistanceBetween(point, treasure);
                        let canSee = LineOfSight(point, treasure);
                        if (distance > 4 && distance < 9 && canSee) {
                            XY.Add(point);
                        }
                    }
                }
            }
        }

        if (XY.Count > 0) {
            for (let i = 0; i < this.OgreMax && XY.Count > 0; i++) {
                if (XY.Count > 0) {
                    let index = rng.Next(XY.Count);
                    this.Map[XY[index].Y][XY[index].X] = "o";
                    this.OgreCount++;
                    XY.RemoveAt(index);
                }
            }
        }
    }

    // Places the minitaurs.
    // HEURISTIC: A minitaur wants to be somewhere within 8 tiles of the entrance, but at least 4 tiles away
    PlaceMinitaur() {
        let XY = [];
        for (let i = 1; i < this.Map.Length - 1; i++) {
            for (let j = 1; j < this.Map[i].Length - 1; j++) {
                if (this.Map[i][j] == " ") {
                    for (let k = 4; k < 9; k++) {
                        try {
                            if (this.Map[i - k][j] == "H") {
                                XY.Add(new Pairing(j, i));
                            }
                        }
                        catch (error) {
                            continue;
                        }
                    }
                    for (let k = 4; k < 9; k++) {
                        try {
                            if (this.Map[i + k][j] == "H" || this.Map[i][j - k] == "H" || this.Map[i][j + k] == "H") {
                                XY.Add(new Pairing(j, i));
                            }
                        }
                        catch (error) {
                            continue;
                        }
                    }
                    for (let k = 4; k < 9; k++) {
                        try {
                            if (this.Map[i][j - k] == "H") {
                                XY.Add(new Pairing(j, i));
                            }
                        }
                        catch (error) {
                            continue;
                        }
                    }
                    for (let k = 4; k < 9; k++) {
                        try {
                            if (this.Map[i][j + k] == "H") {
                                XY.Add(new Pairing(j, i));
                            }
                        }
                        catch (error) {
                            continue;
                        }
                    }
                }
            }
        }

        if (XY.Count > 0) {
            for (let i = 0; i < this.MinitaurMax && XY.Count > 0; i++) {

                if (XY.Count > 0) {
                    let index = rng.Next(XY.Count);
                    this.Map[XY[index].Y][XY[index].X] = "m";
                    this.MinitaurCount++;
                    XY.RemoveAt(index);
                }
            }
        }
    }

    // Places the traps.
    // HEURISTIC: Traps like to be somewhere along the shortest path, or very close to it
    PlaceTrap() {
        // lists for x and y coordinates, mapped by index
        let XY = [];
        // get a list of the points in the shortest path
        for (let i = entranceIndex + 1; i < exitIndex - 1; i++) {
            if (this.Map[this.PathToExit[i].Y][Pthis.athToExit[i].X] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X, this.PathToExit[i].Y));
            }
            // also add potions just along the shortest path on the sides
            if (this.Map[this.PathToExit[i].Y - 1][this.PathToExit[i].X] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X, this.PathToExit[i].Y - 1));
            }
            if (this.Map[this.PathToExit[i].Y][this.PathToExit[i].X - 1] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X - 1, this.PathToExit[i].Y));
            }

            if (this.Map[this.PathToExit[i].Y + 1][this.PathToExit[i].X] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X, this.PathToExit[i].Y + 1));
            }

            if (this.Map[this.PathToExit[i].Y][this.PathToExit[i].X + 1] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X + 1, this.PathToExit[i].Y));
            }

            // also add diagonals

            if (this.Map[this.PathToExit[i].Y - 1][this.PathToExit[i].X - 1] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X - 1, this.PathToExit[i].Y - 1));
            }

            if (this.Map[this.PathToExit[i].Y - 1][this.PathToExit[i].X + 1] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X + 1, this.PathToExit[i].Y - 1));
            }

            if (this.Map[this.PathToExit[i].Y + 1][this.PathToExit[i].X + 1] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X + 1, this.PathToExit[i].Y + 1));
            }

            if (this.Map[this.PathToExit[i].Y + 1][this.PathToExit[i].X - 1] == " ") {
                XY.Add(new Pairing(this.PathToExit[i].X - 1, this.PathToExit[i].Y + 1));
            }
        }

        if (XY.Count > 0) {
            for (let i = 0; i < this.TrapMax && XY.Count > 0; i++) {
                let index = Math.floor(Math.random() * XY.Count);
                this.Map[XY[index].Y][XY[index].X] = "t";
                this.TrapCount++;
                XY.RemoveAt(index);
            }
        }
    }

    // Places the exit.
    // HEURISTIC: The exit likes to be as far as possible from the Entrance
    PlaceExit() {
        let exitIndex = Math.floor(Math.random() * 5) - 13;
        let Exit = this.PathToExit[exitIndex];
        this.Map[Exit.Y][Exit.X] = "e";
        this.ExitPoint = new Pairing(Exit.X, Exit.Y);
    }

    // Finds the path to exit.
    FindPathToExit() {
        // TODO redo this with A* search
        // AStarTree()
        // this.PathToExit = as
        // if (this.PathToExit == null) {
        //     return 1;
        // }
        // return 2;
    }

    // Places the entrance.
    // HEURISTIC: Any possible empty tile can be the Entrance.
    PlaceEntrance() {
        let entranceIndex = Math.floor(Math.random() * 8);
        let Entrance = this.PathToExit[entranceIndex];
        this.Map[Entrance.Y][Entrance.X] = "H";
        EntrancePoint = new Pairing(Entrance.X, Entrance.Y);
    }

    // Prints the map.
    PrintMap() {
        for (let i = 0; i < this.Map.length; i++)
        {
            for (let j = 0; j < this.Map[i].length; j++)
            {
                console.log(this.Map[i][j]);
            }
            console.log("");
        }
        console.log("");
        console.log("");
    }
    /// Gets the map.
    GetMap() {
        return this.Map;
    }

    /// Raycast the specified p1 and p2.
   RayTrace(p1, p2) {
        let x0 = p1.X;
        let y0 = p1.Y;
        let x1 = p2.X;
        let y1 = p2.Y;

        let trace = [];

        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let x = x0;
        let y = y0;
        let n = 1 + dx + dy;
        let x_inc = (x1 > x0) ? 1 : -1;
        let y_inc = (y1 > y0) ? 1 : -1;
        let error = dx - dy;
        dx *= 2;
        dy *= 2;

        for (let tiles = n; tiles > 0; tiles--) {
            trace.push(new Pairing(x, y));
            if (error > 0) {
                x += x_inc;
                error -= dy;
            } else {
                y += y_inc;
                error += dx;
            }
        }
        return trace;
    }

    LineOfSight(start, end) {
        let result = true;
        let rayTrace = this.RayTrace(start, end);
        for (let point = 0; point < rayTrace.Length; point++)
        {
            if (this.Map[rayTrace[point].Y][rayTrace[point].X] == "X") {
                result = false;
                break;
            }
        }
        return result;
    }

    DistanceBetween(start, end) {
        rayTrace = this.RayTrace(start, end);
        return rayTrace.length;
    }
}

