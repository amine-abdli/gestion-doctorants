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
        return response()->json(Doctorant::with('juries', 'diplomes')->get());
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
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
                'date_descution_jury' => 'nullable|date',
                'heure_soutenance'    => 'nullable|string',
                'local_soutenance'    => 'nullable|string',
                'resume'              => 'nullable|string',
                'mot_cle'             => 'nullable|string',
                'status'              => 'nullable|string',

                // juries 
                'juries'              => 'nullable|array',
                'juries.*.id'         => 'required|exists:juries,id',
                'juries.*.nom_modifier' => 'nullable|string',
                'juries.*.role'       => 'nullable|string',
                'juries.*.rolearb'    => 'nullable|string',
                'juries.*.grade'      => 'nullable|string',
                'juries.*.graderb'    => 'nullable|string',
                'juries.*.local'      => 'nullable|string',
            ]);

            $doctorantData = collect($validated)->except('juries')->toArray();
            $doctorant = Doctorant::create($doctorantData);

            if (!empty($validated['juries'])) {
                foreach ($validated['juries'] as $jury) {
                    $doctorant->juries()->attach($jury['id'], [
                        'nom_modifier' => $jury['nom_modifier'] ?? '',
                        'role'  => $jury['role']  ?? '',
                        'rolearb' => $jury['rolearb'] ?? '',
                        'grade' => $jury['grade'] ?? '',
                        'graderb' => $jury['graderb'] ?? '',
                        'local' => $jury['local'] ?? '',
                    ]);
                }
            }

            return response()->json($doctorant->load('juries', 'diplomes'), 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation échouée',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $doctorant = Doctorant::with('juries', 'diplomes')->findOrFail($id);
        return response()->json($doctorant);
    }

    public function update(Request $request, $id)
    {
        try {
            $doctorant = Doctorant::findOrFail($id);

            $validated = $request->validate([
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
                'date_descution_jury' => 'nullable|date',
                'heure_soutenance'    => 'nullable|string',
                'local_soutenance'    => 'nullable|string',
                'resume'              => 'nullable|string',
                'mot_cle'             => 'nullable|string',
                'status'              => 'nullable|string',

                // juries pivot
                'juries'              => 'nullable|array',
                'juries.*.id'         => 'required|exists:juries,id',
                'juries.*.nom_modifier' => 'nullable|string',
                'juries.*.role'       => 'nullable|string',
                'juries.*.rolearb'    => 'nullable|string',
                'juries.*.grade'      => 'nullable|string',
                'juries.*.graderb'    => 'nullable|string',
                'juries.*.local'      => 'nullable|string',
            ]);

            $doctorantData = collect($validated)->except('juries')->toArray();
            $doctorant->update($doctorantData);

            if (array_key_exists('juries', $validated)) {
                $doctorant->juries()->detach();
                foreach ($validated['juries'] as $jury) {
                    $doctorant->juries()->attach($jury['id'], [
                        'nom_modifier' => $jury['nom_modifier'] ?? '',
                        'role'  => $jury['role']  ?? '',
                        'rolearb' => $jury['rolearb'] ?? '',
                        'grade' => $jury['grade'] ?? '',
                        'graderb' => $jury['graderb'] ?? '',
                        'local' => $jury['local'] ?? '',
                    ]);
                }
            }

            return response()->json($doctorant->load('juries', 'diplomes'));

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation échouée',
                'errors'  => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $doctorant = Doctorant::findOrFail($id);
        $doctorant->delete();
        return response()->json(null, 204);
    }
}