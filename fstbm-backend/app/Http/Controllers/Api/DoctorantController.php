<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Doctorant;

class DoctorantController extends Controller
{
    // ================= INDEX =================
    public function index()
    {
        return response()->json(Doctorant::with('juries')->get());
    }

    // ================= STORE =================
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'numero'              => 'nullable|string',
                'nmb_inscription'     => 'required|string|unique:doctorants',
                'nomfr'               => 'nullable|string',
                'nomarb'              => 'nullable|string',
                'cin'                 => 'required|string|unique:doctorants',
                'date_naissance'      => 'nullable|date',
                'lieu_naissance_arb'  => 'nullable|string',
                'discipline_fr'       => 'nullable|string',
                'discipline_arb'      => 'nullable|string',
                'specialite_fr'       => 'nullable|string',
                'specialite_arb'      => 'nullable|string',
                'sujet_fr'            => 'nullable|string',
                'mention_fr'          => 'nullable|string',
                'mention_arb'         => 'nullable|string',
                'date_descution_jury' => 'nullable|date',
                'date_obtinu_diplome' => 'nullable|date',
                'status'              => 'nullable|string',

                // juries pivot
                'juries'              => 'nullable|array',
                'juries.*.id'         => 'required|exists:juries,id',
                'juries.*.role'       => 'nullable|string',
                'juries.*.grade'      => 'nullable|string',
                'juries.*.local'      => 'nullable|string',
            ]);

            // Créer le doctorant (sans les données pivot)
            $doctorantData = collect($validated)->except('juries')->toArray();
            $doctorant = Doctorant::create($doctorantData);

            // Attacher les membres du jury — permet le même jury avec des rôles différents
            if (!empty($validated['juries'])) {
                foreach ($validated['juries'] as $jury) {
                    $doctorant->juries()->attach($jury['id'], [
                        'role'  => $jury['role']  ?? '',
                        'grade' => $jury['grade'] ?? '',
                        'local' => $jury['local'] ?? '',
                    ]);
                }
            }

            return response()->json($doctorant->load('juries'), 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation échouée',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ================= SHOW =================
    public function show($id)
    {
        $doctorant = Doctorant::with('juries')->findOrFail($id);
        return response()->json($doctorant);
    }

    // ================= UPDATE =================
    public function update(Request $request, $id)
    {
        try {
            $doctorant = Doctorant::findOrFail($id);

            $validated = $request->validate([
                'numero'              => 'nullable|string',
                'nmb_inscription'     => 'sometimes|required|string|unique:doctorants,nmb_inscription,' . $id,
                'nomfr'               => 'nullable|string',
                'nomarb'              => 'nullable|string',
                'cin'                 => 'sometimes|required|string|unique:doctorants,cin,' . $id,
                'date_naissance'      => 'nullable|date',
                'lieu_naissance_arb'  => 'nullable|string',
                'discipline_fr'       => 'nullable|string',
                'discipline_arb'      => 'nullable|string',
                'specialite_fr'       => 'nullable|string',
                'specialite_arb'      => 'nullable|string',
                'sujet_fr'            => 'nullable|string',
                'mention_fr'          => 'nullable|string',
                'mention_arb'         => 'nullable|string',
                'date_descution_jury' => 'nullable|date',
                'date_obtinu_diplome' => 'nullable|date',
                'status'              => 'nullable|string',

                // juries pivot
                'juries'              => 'nullable|array',
                'juries.*.id'         => 'required|exists:juries,id',
                'juries.*.role'       => 'nullable|string',
                'juries.*.grade'      => 'nullable|string',
                'juries.*.local'      => 'nullable|string',
            ]);

            // Mettre à jour le doctorant (sans les données pivot)
            $doctorantData = collect($validated)->except('juries')->toArray();
            $doctorant->update($doctorantData);

            // Détacher tous puis re-attacher — permet même jury avec rôles différents
            if (array_key_exists('juries', $validated)) {
                $doctorant->juries()->detach();
                foreach ($validated['juries'] as $jury) {
                    $doctorant->juries()->attach($jury['id'], [
                        'role'  => $jury['role']  ?? '',
                        'grade' => $jury['grade'] ?? '',
                        'local' => $jury['local'] ?? '',
                    ]);
                }
            }

            return response()->json($doctorant->load('juries'));

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation échouée',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    // ================= DELETE =================
    public function destroy($id)
    {
        $doctorant = Doctorant::findOrFail($id);
        $doctorant->delete();
        return response()->json(null, 204);
    }
}